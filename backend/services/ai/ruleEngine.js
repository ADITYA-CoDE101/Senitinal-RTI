'use strict';

/**
 * ai/ruleEngine.js
 * Pure rule-based complaint analyser — no API calls, instant, free.
 */

const KW_MAP = {
  'Road & Infrastructure': ['road','pothole','bridge','footpath','street','highway','drain','pavement','construction','signal','crack','divider'],
  'Water & Sanitation':    ['water','pipe','leak','sewage','sanitation','toilet','contamination','supply','tank','borewell','drainage','pump'],
  'Electricity & Power':   ['electricity','power','light','transformer','wire','voltage','outage','meter','pole','cable','streetlight','tripping'],
  'Healthcare':            ['hospital','doctor','medicine','nurse','health','clinic','ambulance','treatment','medical','pharmacy','injection','ward'],
  'Education':             ['school','teacher','student','college','exam','textbook','scholarship','midday','library','principal','class','fees'],
  'Municipal Services':    ['garbage','waste','dustbin','cleanliness','park','sweep','mosquito','stray','sewage','maintenance','civic'],
  'Land & Property':       ['land','property','plot','encroachment','title','mutation','registry','ownership','boundary','survey','patta'],
  'Public Transport':      ['bus','train','auto','transport','route','stop','ticket','conductor','metro','rickshaw','cab'],
  'Environment':           ['pollution','noise','smoke','factory','chemical','tree','effluent','mining','dust','air','toxic'],
};

const HIGH_KW = ['accident','danger','emergency','death','injury','years','ignored','collapsed','fire','flood','hazard','children','elderly','serious','critical','life-threatening'];
const MED_KW  = ['broken','damaged','weeks','repeated','again','still','leaking','not working','failed','pending','delay','unresponsive'];

const AUTHORITY = {
  'Road & Infrastructure': 'Executive Engineer, Public Works Department (PWD)',
  'Water & Sanitation':    'Chief Engineer, Municipal Water & Sewerage Board',
  'Electricity & Power':   'Superintendent Engineer, State Electricity Distribution Co.',
  'Municipal Services':    'Municipal Commissioner, Urban Local Body',
  'Education':             'District Education Officer (DEO)',
  'Healthcare':            'Chief Medical Officer (CMO), District Health Dept.',
  'Land & Property':       'Sub-Divisional Magistrate (SDM), Revenue Department',
  'Public Transport':      'Regional Transport Officer (RTO)',
  'Environment':           'Member Secretary, State Pollution Control Board',
  'Other':                 'District Collector / District Magistrate',
};

function rulesBasedAnalysis(data) {
  const text     = (data.description || data.voiceTranscript || '').toLowerCase();
  const hasImage = !!(data.imagePath || data.imageFile || data.imageUrl);
  const hasGeo   = !!(data.geoLat || data.geoCoords?.lat);
  const hasVoice = !!data.voiceTranscript;

  // ── Category ──
  let best = { cat: data.category !== 'Other' ? data.category : 'Other', score: 0 };
  for (const [cat, kws] of Object.entries(KW_MAP)) {
    const s = kws.reduce((a, k) => a + (text.includes(k) ? 1 : 0), 0);
    if (s > best.score) best = { cat, score: s };
  }
  const category          = best.cat;
  const categoryAmbiguous = best.score === 0;

  // ── Severity ──
  const hm = HIGH_KW.filter(k => text.includes(k));
  const mm = MED_KW.filter(k => text.includes(k));
  let severity = 'LOW', severityReason = 'Routine civic issue — no urgent risk indicators detected.', severityScore = 30;
  if (hm.length) {
    severity       = 'HIGH';
    severityReason = `Critical indicators detected: ${hm.slice(0, 3).join(', ')}.`;
    severityScore  = Math.min(85 + hm.length * 3, 99);
  } else if (mm.length) {
    severity       = 'MEDIUM';
    severityReason = `Moderate concern: ${mm.slice(0, 3).join(', ')}.`;
    severityScore  = Math.min(45 + mm.length * 8, 80);
  }

  // ── Keywords ──
  const found = new Set();
  Object.values(KW_MAP).flat().forEach(k => { if (text.includes(k)) found.add(k); });
  const keywords = [...found].slice(0, 8);

  // ── Confidence ──
  let confidence = 40
    + Math.min(found.size * 3, 15)
    + (text.length > 50  ? 15 : 0)
    + (text.length > 150 ? 10 : 0)
    + (hasImage          ? 15 : 0)
    + (hasGeo            ? 10 : 0)
    + (hasVoice          ?  5 : 0)
    + (best.score >= 2   ? 10 : 0)
    - (categoryAmbiguous ? 15 : 0);
  confidence = Math.max(20, Math.min(confidence, 94));

  // ── Summary ──
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const summary   = `${category} issue reported: ${(sentences[0] || text).slice(0, 120)}${text.length > 120 ? '...' : ''}.`;

  // ── Evidence flags ──
  const evidenceFlags = [];
  if (hasImage)         evidenceFlags.push('has_image');
  if (hasGeo)           evidenceFlags.push('has_geo');
  if (hasVoice)         evidenceFlags.push('has_voice');
  if (text.length > 100) evidenceFlags.push('detailed_description');

  // ── Legal sections ──
  const legalSections = ['Section 6(1) - RTI Application', 'Section 7 - 30 Day Response Mandate'];
  if (severity === 'HIGH') legalSections.push('Section 7(1) - 48-Hour Emergency Response');

  return {
    category, severity, severityReason, severityScore,
    keywords, summary, confidence,
    authority: AUTHORITY[category] || AUTHORITY['Other'],
    evidenceFlags, legalSections,
    model: 'rule-based',
    _meta: { categoryAmbiguous, keywordMatches: best.score },
  };
}

module.exports = { rulesBasedAnalysis, AUTHORITY, KW_MAP };
