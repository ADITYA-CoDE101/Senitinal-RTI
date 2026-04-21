'use strict';

/**
 * ai/hybridAnalyser.js
 * Orchestrates the hybrid analysis pipeline — identical logic to original aiService.js geminiAnalysis().
 *   Step 1: Rule-based (always runs, instant, free)
 *   Step 2: Gate — should we call Gemini?
 *   Step 3: Gemini (vision if image present)
 *   Step 4: Merge — Gemini enriches, rule-based fills gaps
 */

const { rulesBasedAnalysis } = require('./ruleEngine');
const { callGeminiJSON }     = require('./geminiClient');
const {
  KEYS, AI_THRESHOLD, STRONG_CATEGORY_SCORE, ALWAYS_AI_FOR_HIGH, MIN_TEXT_FOR_RULES,
} = require('./config');

// ── Build analysis prompt (identical to original callGemini prompt) ──
function buildAnalysisPrompt(data, ruleResult) {
  const text     = data.description || data.voiceTranscript || '';
  const hasImage = !!(data.imagePath || data.imageFile || data.imageUrl);
  const hasGeo   = !!(data.geoLat || data.geoCoords?.lat);
  const hasVoice = !!data.voiceTranscript;

  const imageInstruction = hasImage
    ? `An image has been attached. FIRST describe what civic issue you can visually observe in the image (damaged road, broken pipe, garbage pile, etc.), then use that visual evidence to enhance your analysis.`
    : '';

  return `You are an expert RTI complaint analyst for India's government grievance system.
A rule-based pre-analysis gave: category="${ruleResult.category}", severity="${ruleResult.severity}", confidence=${ruleResult.confidence}%.
Your job: refine this analysis using all available evidence. Respond ONLY with valid JSON (no markdown).

${imageInstruction}
Category selected by user: ${data.category}
Description: "${text}"
Has GPS: ${hasGeo}${hasGeo ? ` (${data.geoLat}, ${data.geoLng})` : ''}, Has voice: ${hasVoice}

JSON schema:
{
  "category": "<Road & Infrastructure|Water & Sanitation|Electricity & Power|Municipal Services|Education|Healthcare|Land & Property|Public Transport|Environment|Other>",
  "severity": "<HIGH|MEDIUM|LOW>",
  "severityReason": "<1 sentence explanation>",
  "severityScore": <0-100>,
  "keywords": ["<up to 8 domain keywords>"],
  "summary": "<2 sentence professional RTI summary>",
  "confidence": <0-100>,
  "authority": "<specific Indian govt officer designation and department>",
  "evidenceFlags": ["<has_image|has_geo|has_voice|detailed_description|image_analyzed>"],
  "legalSections": ["<RTI Act 2005 section with number>"],
  "imageAnalysis": "<what you visually observed in the image, or null if no image>"
}`;
}

// ── Gate: identical condition as original needsAI ─────────────────
function needsGemini(data, ruleResult) {
  const text = data.description || data.voiceTranscript || '';
  return (
    KEYS.length > 0 && (
      (ruleResult.confidence < AI_THRESHOLD && (ruleResult._meta?.keywordMatches || 0) < STRONG_CATEGORY_SCORE) ||
      (ALWAYS_AI_FOR_HIGH && ruleResult.severity === 'HIGH') ||
      text.length < MIN_TEXT_FOR_RULES ||
      ruleResult._meta?.categoryAmbiguous ||
      !!(data.imagePath)
    )
  );
}

// ── Merge: identical to original Step 4 ──────────────────────────
function mergeResults(aiResult, ruleResult) {
  return {
    category:       aiResult.category       || ruleResult.category,
    severity:       aiResult.severity       || ruleResult.severity,
    severityReason: aiResult.severityReason || ruleResult.severityReason,
    severityScore:  aiResult.severityScore  || ruleResult.severityScore,
    keywords:       aiResult.keywords?.length ? aiResult.keywords : ruleResult.keywords,
    summary:        aiResult.summary        || ruleResult.summary,
    confidence:     aiResult.confidence     || ruleResult.confidence,
    authority:      aiResult.authority      || ruleResult.authority,
    evidenceFlags:  [...new Set([...(aiResult.evidenceFlags || []), ...(ruleResult.evidenceFlags || [])])],
    legalSections:  aiResult.legalSections?.length ? aiResult.legalSections : ruleResult.legalSections,
    imageAnalysis:  aiResult.imageAnalysis  || null,
    model:          aiResult.model,
  };
}

/**
 * geminiAnalysis(data) → analysis object
 * Main entry point — used by complaintController.js (same interface as before).
 */
async function geminiAnalysis(data) {
  // Step 1 — Rule-based
  const ruleResult = rulesBasedAnalysis(data);

  // Step 2 — Gate
  if (!needsGemini(data, ruleResult)) {
    console.log(`✅ Rule-based sufficient (confidence=${ruleResult.confidence}%, severity=${ruleResult.severity}) — skipping Gemini API call`);
    return ruleResult;
  }

  console.log(`🔀 Hybrid: rule confidence=${ruleResult.confidence}%, severity=${ruleResult.severity} → escalating to Gemini`);

  // Step 3 — Gemini call
  const hasImage = !!(data.imagePath);
  const prompt   = buildAnalysisPrompt(data, ruleResult);
  const aiResult = await callGeminiJSON(prompt, {
    vision:    hasImage,
    imagePath: data.imagePath,
    label:     'Analysis',
  });

  if (!aiResult) {
    console.log('⬇️  Gemini unavailable — returning rule-based result');
    ruleResult.model = 'rule-based-fallback';
    return ruleResult;
  }

  // Stamp evidence flags (identical to original)
  if (hasImage && !aiResult.evidenceFlags?.includes('has_image'))      aiResult.evidenceFlags?.push('has_image');
  if (hasImage && aiResult.imageAnalysis && !aiResult.evidenceFlags?.includes('image_analyzed')) aiResult.evidenceFlags?.push('image_analyzed');
  if (data.geoLat        && !aiResult.evidenceFlags?.includes('has_geo'))   aiResult.evidenceFlags?.push('has_geo');
  if (data.voiceTranscript && !aiResult.evidenceFlags?.includes('has_voice')) aiResult.evidenceFlags?.push('has_voice');

  console.log(`🤖 ${aiResult.model} ✅: ${aiResult.category} | ${aiResult.severity} | ${aiResult.confidence}%${aiResult.imageAnalysis ? ' | 📸 image analyzed' : ''} (key rotated)`);

  // Step 4 — Merge
  return mergeResults(aiResult, ruleResult);
}

module.exports = { geminiAnalysis };
