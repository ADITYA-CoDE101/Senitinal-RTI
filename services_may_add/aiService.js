'use strict';

/**
 * services/aiService.js  ← public API (backward-compatible shim)
 *
 * This file is the single entry point that the rest of the backend uses.
 * All implementation has been moved to the ai/ sub-modules:
 *
 *   ai/config.js          — thresholds, API keys, model lists
 *   ai/ruleEngine.js      — keyword-based instant analysis
 *   ai/geminiClient.js    — low-level Gemini API wrapper (text + vision)
 *   ai/hybridAnalyser.js  — orchestrates rule → gate → Gemini → merge
 *   ai/draftGenerator.js  — RTI application draft (Gemini + template fallback)
 *
 * To add a new feature, edit the relevant sub-module — not this file.
 */

const { geminiAnalysis }                     = require('./ai/hybridAnalyser');
const { rulesBasedAnalysis }                 = require('./ai/ruleEngine');
const { generateRTIDraft, rulesBasedDraft }  = require('./ai/draftGenerator');

module.exports = { geminiAnalysis, rulesBasedAnalysis, generateRTIDraft, rulesBasedDraft };
