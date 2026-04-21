'use strict';

/**
 * ai/config.js
 * Central configuration for the AI pipeline.
 * Change thresholds here — no other file needs to be touched.
 */

// Hybrid routing thresholds
const AI_THRESHOLD          = 72;   // rule-based confidence below this → call Gemini
const STRONG_CATEGORY_SCORE = 2;    // strong keyword match → skip Gemini even if below threshold
const ALWAYS_AI_FOR_HIGH    = true; // always verify HIGH severity with Gemini
const MIN_TEXT_FOR_RULES    = 30;   // descriptions shorter than this are always ambiguous

// Gemini API key pool — load from env, drop any placeholder values
const KEYS = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
].filter(k => k && k !== 'YOUR_GEMINI_API_KEY');

// Round-robin key index — shared mutable state, module-level is fine here
let keyIndex = 0;
const nextKey   = ()  => KEYS[(keyIndex) % KEYS.length];
const advanceKey = (offset) => { keyIndex = (keyIndex + offset + 1) % KEYS.length; };

// Gemini model lists
const VISION_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];              // support image input
const TEXT_MODELS   = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.0-pro']; // text-only

module.exports = {
  AI_THRESHOLD, STRONG_CATEGORY_SCORE, ALWAYS_AI_FOR_HIGH, MIN_TEXT_FOR_RULES,
  KEYS, nextKey, advanceKey,
  VISION_MODELS, TEXT_MODELS,
};
