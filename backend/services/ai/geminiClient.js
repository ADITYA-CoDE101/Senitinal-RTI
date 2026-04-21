'use strict';

/**
 * ai/geminiClient.js
 * Low-level Gemini API wrapper.
 * Handles: multi-modal content building, key rotation, quota retries, JSON parsing.
 * Identical retry/rotation logic as the original aiService.js callGemini().
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs   = require('fs');
const path = require('path');
const cfg  = require('./config');  // use cfg.KEYS, cfg.keyIndex directly via ref

// ── Image → base64 inline data part ──────────────────────────────
function buildImagePart(imagePath) {
  const buffer   = fs.readFileSync(imagePath);
  const base64   = buffer.toString('base64');
  const ext      = path.extname(imagePath).slice(1).toLowerCase();
  const MIME_MAP = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', gif:'image/gif' };
  const mimeType = MIME_MAP[ext] || 'image/jpeg';
  console.log(`📸 Image attached: ${path.basename(imagePath)} (${Math.round(buffer.length / 1024)} KB)`);
  return { inlineData: { data: base64, mimeType } };
}

/**
 * callGemini(prompt, options) → string | null
 * Tries each model × each key (same rotation as original).
 *
 * @param {string}  prompt
 * @param {object}  [options]
 * @param {boolean} [options.vision=false]          use vision-capable models only
 * @param {string}  [options.imagePath]             attach image as inline data
 * @param {object}  [options.generationConfig={}]   temperature / maxOutputTokens
 * @param {string}  [options.label='Gemini']        label for console logs
 */
async function callGemini(prompt, options = {}) {
  const { KEYS, VISION_MODELS, TEXT_MODELS } = cfg;
  if (!KEYS.length) return null;

  const { vision = false, imagePath, generationConfig = {}, label = 'Gemini' } = options;
  const MODELS = vision ? VISION_MODELS : TEXT_MODELS;

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < KEYS.length; attempt++) {
      // ── IDENTICAL to original: (keyIndex + attempt) % KEYS.length ──
      const currentKey = KEYS[(cfg.keyIndex + attempt) % KEYS.length];
      try {
        const genAI  = new GoogleGenerativeAI(currentKey);
        const model  = genAI.getGenerativeModel({ model: modelName, generationConfig });

        // Build content parts (image + text, or text only)
        const parts = [];
        if (imagePath) {
          try { parts.push(buildImagePart(imagePath)); }
          catch (e) { console.warn(`⚠️  Could not read image for vision: ${e.message}`); }
        }
        parts.push({ text: prompt });

        const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
        const text   = result.response.text().trim();

        // ── IDENTICAL to original: advance keyIndex on success ──
        cfg.keyIndex = (cfg.keyIndex + attempt + 1) % KEYS.length;
        console.log(`✅ ${label} via ${modelName} (key ${attempt + 1})`);
        return text;
      } catch (err) {
        const isQuota = err.message.includes('429') || err.message.includes('quota') || err.message.includes('rate');
        console.warn(`⚠️  ${modelName} key${attempt + 1}: ${isQuota ? 'quota exhausted' : err.message.slice(0, 60)}`);
        if (!isQuota) break; // non-quota error — skip remaining keys for this model
      }
    }
  }

  return null; // all models + keys exhausted
}

/**
 * callGeminiJSON(prompt, options) → object | null
 * Like callGemini but strips markdown fences and JSON.parses the response.
 */
async function callGeminiJSON(prompt, options = {}) {
  const raw = await callGemini(prompt, options);
  if (!raw) return null;
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn(`⚠️  Gemini JSON parse failed: ${e.message}`);
    return null;
  }
}

module.exports = { callGemini, callGeminiJSON };
