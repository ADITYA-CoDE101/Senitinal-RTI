'use strict';

/**
 * ai/geminiClient.js
 * Low-level Gemini API wrapper.
 * Handles: multi-modal content building, key rotation, quota retries, JSON parsing.
 * Knows nothing about RTI drafts or complaint logic.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs   = require('fs');
const path = require('path');
const { KEYS, advanceKey, VISION_MODELS, TEXT_MODELS } = require('./config');

// ── Image → base64 inline data part ──────────────────────────────
async function buildContentParts(imagePath, promptText) {
  const parts = [];

  if (imagePath) {
    try {
      const buffer   = fs.readFileSync(imagePath);
      const base64   = buffer.toString('base64');
      const ext      = path.extname(imagePath).slice(1).toLowerCase();
      const MIME_MAP = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
      const mimeType = MIME_MAP[ext] || 'image/jpeg';
      parts.push({ inlineData: { data: base64, mimeType } });
      console.log(`📸 Image attached for vision analysis: ${path.basename(imagePath)} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (e) {
      console.warn(`⚠️  Could not read image for vision: ${e.message}`);
    }
  }

  parts.push({ text: promptText });
  return parts;
}

/**
 * callGemini(prompt, options) → string | null
 * Tries each model × each key; returns the raw text response or null if all fail.
 *
 * @param {string}   prompt
 * @param {object}   [options]
 * @param {boolean}  [options.vision=false]   — use vision-capable models only
 * @param {string}   [options.imagePath]      — attach image as inline data
 * @param {object}   [options.generationConfig] — override temperature / tokens
 * @param {string}   [options.label='Gemini'] — label for console logs
 */
async function callGemini(prompt, options = {}) {
  if (!KEYS.length) return null;

  const { vision = false, imagePath, generationConfig = {}, label = 'Gemini' } = options;
  const MODELS = vision ? VISION_MODELS : TEXT_MODELS;

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < KEYS.length; attempt++) {
      const currentKey = KEYS[(attempt) % KEYS.length];
      try {
        const genAI  = new GoogleGenerativeAI(currentKey);
        const model  = genAI.getGenerativeModel({ model: modelName, generationConfig });
        const parts  = imagePath
          ? await buildContentParts(imagePath, prompt)
          : [{ text: prompt }];
        const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
        const text   = result.response.text().trim();
        advanceKey(attempt);
        console.log(`✅ ${label} via ${modelName} (key ${attempt + 1})`);
        return text;
      } catch (err) {
        const isQuota = err.message.includes('429') || err.message.includes('quota') || err.message.includes('rate');
        console.warn(`⚠️  ${modelName} key${attempt + 1}: ${isQuota ? 'quota exhausted' : err.message.slice(0, 60)}`);
        if (!isQuota) break; // non-quota error (auth, bad request) — skip remaining keys for this model
      }
    }
  }

  return null; // all models + keys exhausted
}

/**
 * callGeminiJSON(prompt, options) → object | null
 * Like callGemini but parses the response as JSON, stripping any markdown fences.
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
