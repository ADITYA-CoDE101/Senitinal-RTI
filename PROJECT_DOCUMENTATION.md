# Sentinel-RTI — Complete Project Documentation
<!-- SECTIONS 6–8 appended below the original Part 1 -->


> **Structure follows the Sentinel-RTI Workflow:** User Input → AI Processing → Complaint Generation → Smart Routing → Submission & Verification → Lifecycle Tracking → Automated Follow-Ups → Escalation Engine → Analytics Dashboard

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [Project File Structure](#3-project-file-structure)
4. [Layer 1 — User Input](#4-layer-1--user-input)
5. [Layer 2 — AI Processing](#5-layer-2--ai-processing)
6. [Layer 3 — Complaint Generation](#6-layer-3--complaint-generation)
7. [Layer 4 — Smart Routing](#7-layer-4--smart-routing)
8. [Layer 5 — Submission & Verification](#8-layer-5--submission--verification)
9. [Layer 6 — Lifecycle Tracking](#9-layer-6--lifecycle-tracking)
10. [Layer 7 — Automated Follow-Ups](#10-layer-7--automated-follow-ups)
11. [Layer 8 — Escalation Engine](#11-layer-8--escalation-engine)
12. [Layer 9 — Analytics Dashboard](#12-layer-9--analytics-dashboard)
13. [Database Models](#13-database-models)
14. [API Reference](#14-api-reference)
15. [Authentication & Security](#15-authentication--security)
16. [RTI Legal Knowledge Base](#16-rti-legal-knowledge-base)
17. [Frontend Architecture](#17-frontend-architecture)
18. [Environment Variables](#18-environment-variables)
19. [How to Run the Project](#19-how-to-run-the-project)

---

## 1. Project Overview

**Sentinel-RTI** is a full-stack MERN (MongoDB, Express, React, Node.js) web application that helps Indian citizens file Right to Information (RTI) applications automatically. A citizen describes a civic grievance — by typing text, uploading a photo, recording voice, or sharing GPS location — and the system:

1. Analyses the complaint using AI (Google Gemini) and rule-based NLP
2. Identifies the correct government authority
3. Generates a legally compliant RTI application draft
4. Automatically submits it to **rtionline.gov.in** using browser automation (Puppeteer)
5. Tracks the complaint lifecycle and schedules follow-up reminders, appeals, and escalations

**Key Design Principle:** The system is built with a *hybrid AI approach* — fast rule-based logic handles simple, clear complaints for free, while Google Gemini API is called only when needed (ambiguous categories, HIGH severity, images, or very short descriptions). This keeps costs low and ensures the system always works even when API quotas are exhausted.

---

## 2. Technology Stack & Dependencies

### Backend (`backend/package.json`)

| Package | Version | What it does | Why we use it |
|---|---|---|---|
| `express` | ^4.21.0 | Web framework — handles HTTP routing | Industry-standard Node.js framework; minimal boilerplate |
| `mongoose` | ^8.7.0 | MongoDB ODM — schema definition & DB operations | Provides type-safe schemas, pre-save hooks, aggregation pipelines |
| `dotenv` | ^16.4.5 | Loads `.env` file into `process.env` | Keeps secrets (API keys, DB URI) out of source code |
| `cors` | ^2.8.5 | Allows cross-origin requests from the frontend | Frontend runs on port 5173, backend on 5000 — CORS enables them to communicate |
| `bcryptjs` | ^3.0.3 | Password hashing | One-way hash ensures plain passwords are never stored in the database |
| `jsonwebtoken` | ^9.0.3 | Creates and verifies JWT tokens | Stateless authentication — no server-side session storage needed |
| `multer` | ^2.1.1 | Handles `multipart/form-data` file uploads | Allows citizens to attach photos of civic issues |
| `puppeteer` | ^24.42.0 | Headless Chromium browser automation | Automates the multi-step RTI portal form submission on rtionline.gov.in |
| `@google/generative-ai` | ^0.24.1 | Official Google Gemini API SDK | Powers AI analysis and RTI draft generation |
| `crypto-js` | ^4.2.0 | AES-256 encryption/decryption | Encrypts RTI portal credentials before storing in MongoDB |
| `nodemon` | ^3.1.7 | Auto-restarts server on file change | Development convenience only |

### Frontend (`package.json` — Vite + React)

| Package | What it does |
|---|---|
| `react` | Component-based UI library |
| `vite` | Fast build tool & dev server |
| `concurrently` | Runs backend + frontend servers simultaneously with one command |

### Database
- **MongoDB** (cloud-hosted via MongoDB Atlas) — NoSQL document database
- Connection string stored in `MONGODB_URI` environment variable

---

## 3. Project File Structure

```
Senitinal-RTI/
├── package.json                    ← Root: runs both servers with `npm run dev`
├── vite.config.js                  ← Vite config (API proxy: /api → localhost:5000)
├── index.html                      ← Vite entry HTML
│
├── src/                            ← FRONTEND (React + Vite)
│   ├── main.jsx                    ← React entry point — mounts <App />
│   ├── App.jsx                     ← Root component — page state & navigation
│   ├── index.css                   ← Global styles
│   ├── components/
│   │   ├── Navbar.jsx              ← Adaptive navigation bar
│   │   └── Icon.jsx                ← SVG icon component
│   └── pages/
│       ├── Home.jsx                ← Main complaint submission form
│       ├── About.jsx               ← Project about page
│       └── Contact.jsx             ← Contact form page
│
└── backend/                        ← BACKEND (Node.js + Express)
    ├── server.js                   ← Express app setup, middleware, routes, startup
    ├── index.js                    ← Legacy entry (not used in production)
    ├── .env                        ← Environment variables (not in git)
    │
    ├── config/
    │   └── db.js                   ← MongoDB connection function
    │
    ├── middleware/
    │   └── authMiddleware.js       ← JWT verification middleware
    │
    ├── models/
    │   ├── User.js                 ← Mongoose schema: user accounts
    │   ├── Complaint.js            ← Mongoose schema: complaints + lifecycle
    │   └── Contact.js              ← Mongoose schema: contact form submissions
    │
    ├── routes/
    │   ├── authRoutes.js           ← POST /login, POST /register, GET /me
    │   ├── complaintRoutes.js      ← POST /analyze, POST /, GET /search, PATCH /:id/status
    │   ├── contactRoutes.js        ← POST /contact, GET /contact
    │   ├── dashboardRoutes.js      ← GET /stats
    │   └── rtiPortalRoutes.js      ← Credentials, submit, status, check-registration
    │
    ├── controllers/
    │   ├── authController.js       ← login(), register(), getMe()
    │   ├── complaintController.js  ← analyzeComplaint(), submitComplaint(), etc.
    │   ├── contactController.js    ← submitContact(), getContacts()
    │   ├── dashboardController.js  ← getDashboardStats()
    │   └── rtiPortalController.js  ← saveRTICredentials(), submitToRTIPortal(), etc.
    │
    ├── services/
    │   ├── aiService.js            ← Thin facade: re-exports from ai/ submodules
    │   │
    │   ├── ai/                     ← AI processing pipeline
    │   │   ├── config.js           ← API keys, model names, thresholds
    │   │   ├── geminiClient.js     ← Gemini API wrapper (key rotation, vision, JSON)
    │   │   ├── ruleEngine.js       ← Pure keyword-based analyser (no API calls)
    │   │   ├── hybridAnalyser.js   ← Orchestrates rule → gate → Gemini → merge
    │   │   ├── draftGenerator.js   ← RTI application draft (AI + rule-based fallback)
    │   │   └── rtiLegalKnowledge.js ← Static RTI Act 2005 legal reference
    │   │
    │   └── rtiPortal/              ← Puppeteer automation
    │       ├── index.js            ← Orchestrator: 6-step submission flow
    │       ├── rtionlineAdapter.js ← Page interaction: click, type, wait
    │       ├── ministryMapper.js   ← Category → Ministry name mapping
    │       └── credentialService.js ← AES-256 encrypt/decrypt
    │
    └── uploads/                    ← Saved image files (auto-created)
```

---

## 4. Layer 1 — User Input

**What this layer does:** Accepts civic complaint data from the citizen in four different formats and passes it to the backend.

### 4.1 Frontend Entry Point

**File:** `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```
- **What:** Standard React app bootstrap. `ReactDOM.createRoot` is the React 18 API for rendering.
- **Why:** React 18's concurrent mode enables better performance with transitions and suspense.
- **How:** Finds the `<div id="root">` in `index.html` and mounts the entire React tree inside it.

---

**File:** `src/App.jsx`
```jsx
export default function App() {
  const [page, setPage] = useState('home')
  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <>
      <Navbar page={page} navigate={navigate} />
      {page === 'home'    && <Home navigate={navigate} />}
      {page === 'about'   && <About navigate={navigate} />}
      {page === 'contact' && <Contact navigate={navigate} />}
    </>
  )
}
```
- **What:** Root component that manages which page is visible using a simple `page` state string.
- **Why we didn't use React Router:** This is a single-page app with only 3 pages — a full router library would be unnecessary overhead. The manual conditional render is simpler.
- **How:** `useState('home')` starts on the Home page. The `navigate` function updates state AND scrolls to top (good UX). It passes `navigate` down as a prop so any child page can trigger navigation.

---

### 4.2 The Four Input Modes

**File:** `src/pages/Home.jsx` (complaint form section)

The Home page collects input in four modes:

| Mode | Field | What the user provides |
|---|---|---|
| **Text** | `description` | Types the complaint in a textarea |
| **Image** | `image` (file) | Uploads a photo of the civic issue |
| **Voice** | `voiceTranscript` | Records voice → browser speech recognition converts to text |
| **Geo Location** | `geoLat`, `geoLng` | Browser Geolocation API captures GPS coordinates |

**Why multiple input modes?**
Many citizens in India may find it easier to photograph a pothole or speak about a problem rather than type a formal description. Capturing GPS makes the complaint location-verifiable, which strengthens the RTI application.

---

### 4.3 Image Upload — Multer Configuration

**File:** `backend/routes/complaintRoutes.js`
```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images and PDFs allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
```
- **`multer.diskStorage`** — saves the file directly to disk (not to memory/RAM), which is safer for large files.
- **`destination`** — all uploads go into `backend/uploads/`. This folder is auto-created in `server.js` on startup.
- **`filename`** — uses `Date.now() + random number + extension` to guarantee a unique filename and prevent overwrites.
- **`fileFilter`** — only allows image types and PDF. Prevents users from uploading executables or other dangerous files.
- **`limits.fileSize`** — caps uploads at 10MB. Multer rejects oversized files before they hit the controller.
- **`upload.single('image')`** on the route means only one file, named `image`, is accepted per request.

---

### 4.4 Server Startup & Uploads Directory

**File:** `backend/server.js` (lines 14–18)
```js
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
```
- **What:** Checks if the `uploads/` directory exists on disk; creates it if not.
- **Why:** Multer will crash if the destination directory doesn't exist. This guard runs on every server start, so the folder is always ready.
- **`{ recursive: true }`** — creates parent directories too if they don't exist (safe flag).

```js
app.use('/uploads', express.static(uploadsDir));
```
- **What:** Serves files from the `uploads/` folder as static HTTP assets.
- **Why:** After a file is uploaded, its path is stored in the DB as `/uploads/filename.jpg`. The frontend can fetch this URL directly from the browser.

---

## 5. Layer 2 — AI Processing

**What this layer does:** Takes the raw complaint data and produces a structured analysis object: `{ category, severity, keywords, summary, confidence, authority, evidenceFlags, legalSections }`.

This layer is entirely inside `backend/services/ai/`.

### 5.1 AI Config

**File:** `backend/services/ai/config.js`
```js
const AI_THRESHOLD          = 72;   // rule-based confidence below this → call Gemini
const STRONG_CATEGORY_SCORE = 2;    // strong keyword match → skip Gemini even if below threshold
const ALWAYS_AI_FOR_HIGH    = true; // always verify HIGH severity with Gemini
const MIN_TEXT_FOR_RULES    = 30;   // descriptions shorter than this are always ambiguous

const KEYS = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
].filter(k => k && k !== 'YOUR_GEMINI_API_KEY');

let keyIndex = 0;

const VISION_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];
const TEXT_MODELS   = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.0-pro'];
```
- **`AI_THRESHOLD = 72`** — If the rule engine scores confidence below 72%, it's not confident enough to skip Gemini.
- **`STRONG_CATEGORY_SCORE = 2`** — If 2+ keywords match a category, the rule result is reliable even if confidence is below 72%.
- **`ALWAYS_AI_FOR_HIGH = true`** — HIGH severity complaints (accidents, danger, emergencies) always get Gemini review for extra accuracy.
- **`MIN_TEXT_FOR_RULES = 30`** — A 10-character complaint like "road bad" is too vague for rules; always send to Gemini.
- **Key pool:** We support up to 4 Gemini API keys. The `filter()` removes any keys that are still set to the placeholder value. This allows rotating through keys when one hits its quota limit.
- **`keyIndex`** — A module-level mutable integer. It's shared across all calls in the same server process, acting as a round-robin pointer.
- **`VISION_MODELS`** — Only these models support image (multimodal) input.
- **`TEXT_MODELS`** — The full list, tried in priority order.

---

### 5.2 Rule Engine (Step 1 — Always Runs)

**File:** `backend/services/ai/ruleEngine.js`

```js
const KW_MAP = {
  'Road & Infrastructure': ['road','pothole','bridge','footpath','street','highway',...],
  'Water & Sanitation':    ['water','pipe','leak','sewage','sanitation',...],
  // ... 9 categories total
};

const HIGH_KW = ['accident','danger','emergency','death','injury','years','ignored',...];
const MED_KW  = ['broken','damaged','weeks','repeated','still','leaking',...];

const AUTHORITY = {
  'Road & Infrastructure': 'Executive Engineer, Public Works Department (PWD)',
  // ...
};
```

**`rulesBasedAnalysis(data)` function:**
```js
function rulesBasedAnalysis(data) {
  const text = (data.description || data.voiceTranscript || '').toLowerCase();
  // 1. Category: find which KW_MAP bucket has most keyword hits
  let best = { cat: 'Other', score: 0 };
  for (const [cat, kws] of Object.entries(KW_MAP)) {
    const s = kws.reduce((a, k) => a + (text.includes(k) ? 1 : 0), 0);
    if (s > best.score) best = { cat, score: s };
  }
  // 2. Severity: count HIGH/MED keywords
  const hm = HIGH_KW.filter(k => text.includes(k));
  const mm = MED_KW.filter(k => text.includes(k));
  // 3. Confidence: formula based on text length, keyword hits, image, geo
  // 4. Returns structured result
}
```

- **What:** Pure JavaScript — no API calls, runs in microseconds.
- **Why:** Makes the system work even when Gemini API is unavailable or quota-exceeded.
- **Category detection:** Counts how many keywords from each category appear in the lowercase complaint text. The category with the highest count wins.
- **Severity detection:** Checks for HIGH-urgency words (accident, emergency, death) first, then MEDIUM (broken, weeks, damaged), else LOW.
- **Confidence formula:** Starts at 40, adds points for text length (+15 if >50 chars, +10 if >150), keyword hits, image attached (+15), GPS attached (+10), voice (+5), strong category match (+10). Subtracts 15 if category is ambiguous (zero keyword matches).
- **Authority mapping:** `AUTHORITY[category]` directly returns the correct government officer designation for each category.

---

### 5.3 Gemini Client (Key Rotation & Vision)

**File:** `backend/services/ai/geminiClient.js`

```js
async function callGemini(prompt, options = {}) {
  const MODELS = vision ? VISION_MODELS : TEXT_MODELS;

  for (const modelName of MODELS) {              // outer loop: try each model
    for (let attempt = 0; attempt < KEYS.length; attempt++) {  // inner loop: try each key
      const currentKey = KEYS[(cfg.keyIndex + attempt) % KEYS.length];
      try {
        const genAI  = new GoogleGenerativeAI(currentKey);
        const model  = genAI.getGenerativeModel({ model: modelName, generationConfig });
        const parts  = [];
        if (imagePath) parts.push(buildImagePart(imagePath)); // add image if present
        parts.push({ text: prompt });
        const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
        cfg.keyIndex = (cfg.keyIndex + attempt + 1) % KEYS.length; // advance key on success
        return result.response.text().trim();
      } catch (err) {
        const isQuota = err.message.includes('429') || err.message.includes('quota');
        if (!isQuota) break; // non-quota error: skip remaining keys for this model
      }
    }
  }
  return null; // all models + keys exhausted
}
```

- **Double-loop strategy:** Outer loop tries models in priority order. Inner loop tries all available API keys for each model. This maximises uptime when some keys are quota-exhausted.
- **`buildImagePart(imagePath)`** — reads the image file from disk, converts to base64, and wraps it as a Gemini `inlineData` part. The Gemini API requires base64-encoded images in this format.
- **`cfg.keyIndex` advance** — After a successful call, the key index is moved forward so the next call starts with a different key. This distributes load across keys.
- **429 detection** — HTTP 429 means "Too Many Requests" (quota exceeded). We only advance to the next key on 429 errors. For other errors (like bad prompt or network issues), we stop trying keys and move to the next model.
- **`callGeminiJSON`** — Wraps `callGemini`, strips markdown code fences (` ```json ` ... ` ``` `), and parses the result as JSON. Gemini sometimes wraps JSON in markdown, so the stripping is necessary.

---

### 5.4 Hybrid Analyser (Orchestrator)

**File:** `backend/services/ai/hybridAnalyser.js`

```js
async function geminiAnalysis(data) {
  // Step 1 — Rule-based (always, instant)
  const ruleResult = rulesBasedAnalysis(data);

  // Step 2 — Gate: should we call Gemini?
  if (!needsGemini(data, ruleResult)) {
    return ruleResult; // fast path — no API call
  }

  // Step 3 — Gemini call
  const aiResult = await callGeminiJSON(prompt, { vision: hasImage, imagePath: data.imagePath });

  if (!aiResult) {
    ruleResult.model = 'rule-based-fallback';
    return ruleResult; // Gemini unavailable — use rule result
  }

  // Step 4 — Merge
  return mergeResults(aiResult, ruleResult);
}
```

**Gate function (`needsGemini`):**
```js
function needsGemini(data, ruleResult) {
  return (KEYS.length > 0 && (
    (ruleResult.confidence < AI_THRESHOLD && keywordMatches < STRONG_CATEGORY_SCORE) ||
    (ALWAYS_AI_FOR_HIGH && ruleResult.severity === 'HIGH') ||
    text.length < MIN_TEXT_FOR_RULES ||
    ruleResult._meta?.categoryAmbiguous ||
    !!(data.imagePath)  // always use vision if image present
  ));
}
```

**Merge function:**
```js
function mergeResults(aiResult, ruleResult) {
  return {
    category:      aiResult.category      || ruleResult.category,    // Gemini preferred
    severity:      aiResult.severity      || ruleResult.severity,
    keywords:      aiResult.keywords?.length ? aiResult.keywords : ruleResult.keywords,
    confidence:    aiResult.confidence    || ruleResult.confidence,
    authority:     aiResult.authority     || ruleResult.authority,
    evidenceFlags: [...new Set([...aiResult.evidenceFlags, ...ruleResult.evidenceFlags])],
    // ...
  };
}
```

- **Why hybrid?** Rule-based is free and instant. Gemini is paid and slower. We only pay for Gemini when the rule engine is genuinely unsure.
- **Always vision for images:** If the user attached a photo, we always call Gemini with vision — the image contains spatial information (actual road condition, actual broken pipe) that keywords cannot capture.
- **Merge philosophy:** Gemini output is preferred field-by-field, but falls back to rule-based if Gemini returns null for a field. `evidenceFlags` is merged and deduplicated with `Set`.
- **`model` field in output** — Records which path was taken: `'gemini-2.0-flash'`, `'gemini-1.5-flash'`, or `'rule-based-fallback'`. Stored in the DB for audit purposes.

---
---

## 6. Layer 3 — Complaint Generation (RTI Draft)

**What this layer does:** Produces a complete, legally-worded RTI application document ready to submit to the government portal.

### 6.1 Draft Generator

**File:** `backend/services/ai/draftGenerator.js`

There are two code paths — AI draft (Gemini) and rule-based fallback:

#### Path A — Gemini AI Draft

```js
async function generateRTIDraft(data, ai) {
  const legalContext = getEssentialLegalContext(); // inject RTI Act sections

  const prompt = `You are a senior Indian legal expert...
  ${legalContext}               // ← actual Act text injected here
  Category: ${category}
  Description: "${description}"
  ...
  Write ONLY the RTI application text.`;

  const draft = await callGemini(prompt, {
    generationConfig: { temperature: 0.4, maxOutputTokens: 1800 },
  });

  return draft || rulesBasedDraft(data, ai); // fallback if quota exhausted
}
```

- **`temperature: 0.4`** — Low temperature means the model stays formal and consistent. High temperature produces creative/random text, which is bad for legal documents.
- **`maxOutputTokens: 1800`** — Caps the draft at ~1800 tokens (~1400 words), enough for a complete RTI application.
- **Why inject `legalContext`?** Instead of a RAG (Retrieval-Augmented Generation) vector database, we inject the actual RTI Act sections directly into the prompt. The model then uses exact statutory language (Section 6(1), Section 7(1), Section 19(1)) in the draft — legally accurate without infrastructure overhead.

#### Path B — Rule-Based Template

```js
function rulesBasedDraft(data, ai) {
  const questions = CATEGORY_QUESTIONS[category] || DEFAULT_QUESTIONS;
  return `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005
To,
The Public Information Officer (PIO),
${authority},
...
I hereby request the following specific information under Section 6(1):
${questions.map((q, i) => `${i + 1}. Kindly furnish ${q}.`).join('\n\n')}
...`;
}
```

- **`CATEGORY_QUESTIONS`** — A hardcoded map of 9 categories × 4 precise information requests each. These are professionally drafted legal questions.
- **Why keep the fallback?** If all Gemini API keys are quota-exhausted, the system still generates a valid, useful RTI draft — it just uses the template instead of AI prose.
- **How the template is chosen:** `CATEGORY_QUESTIONS[category]` picks the right question set. If the category is unknown, it defaults to Road & Infrastructure questions.

---

### 6.2 RTI Legal Knowledge Base

**File:** `backend/services/ai/rtiLegalKnowledge.js`

This file replaces the need for a RAG/vector database. It is a pure JS module exporting structured legal content from the RTI Act, 2005.

```js
// Key exports:
ACT_OVERVIEW          // full title, enactment date, scope
DEFINITIONS           // Section 2(f), 2(h), 2(j), 2(l) — legal terms
KEY_SECTIONS          // Sections 3,4,5,6,7,8,9,11,18,19,20 verbatim
FEE_STRUCTURE         // Rs.10 fee, BPL exemption, per-page costs
TIMELINES             // 30-day, 48-hour, 5-day transfer rules
APPEAL_GROUNDS        // 9 common grounds for first/second appeal
IMPORTANT_PRINCIPLES  // key CIC decisions

// Helper functions:
getLegalContextForPrompt(opts)  // full context string, configurable
getEssentialLegalContext()      // lightweight: Sections 3,6,7,8,19,20 + fees
```

- **`getEssentialLegalContext()`** is called inside `draftGenerator.js` before every Gemini draft call. It returns the core Act provisions as a plain text string that is embedded directly in the prompt.
- **Why not RAG?** RAG requires: a vector database (Pinecone/Weaviate), an embedding model, chunking logic, and retrieval pipelines. For a fixed, known document (the RTI Act), it is massive overkill. A static JS file is simpler, faster, and free.

---

## 7. Layer 4 — Smart Routing

**What this layer does:** Identifies which government ministry/authority the complaint should go to, and selects the correct submission platform (rtionline.gov.in for Central Govt).

### 7.1 Authority Assignment — Two places

**A) Complaint Model pre-validate hook (`models/Complaint.js`):**
```js
const AUTHORITY_MAP = {
  'Road & Infrastructure': 'PWD Municipal Corporation',
  'Water & Sanitation':    'Water Supply & Sewerage Board',
  'Electricity & Power':   'State Electricity Distribution Company',
  ...
};

complaintSchema.pre('validate', async function (next) {
  if (this.isNew) {
    this.authority = AUTHORITY_MAP[this.category] || AUTHORITY_MAP['Other'];
  }
  next();
});
```
- Runs automatically before every new complaint is saved to MongoDB.
- Assigns the local state-level authority (used in the RTI draft header).

**B) Ministry Mapper (`services/rtiPortal/ministryMapper.js`):**
```js
const CATEGORY_TO_MINISTRY = {
  'Road & Infrastructure': 'Ministry of Road Transport and Highways',
  'Water & Sanitation':    'Ministry of Jal Shakti',
  'Electricity & Power':   'Ministry of Power',
  'Healthcare':            'Ministry of Health and Family Welfare',
  'Education':             'Ministry of Education',
  'Municipal Services':    'Ministry of Housing and Urban Affairs',
  'Land & Property':       'Ministry of Rural Development',
  'Public Transport':      'Ministry of Railways',
  'Environment':           'Ministry of Environment, Forest and Climate Change',
  'Other':                 'Department of Personnel and Training',
};
```
- Maps to **Central Government ministries** for rtionline.gov.in submission.
- Ministry names must match **exactly** what appears in the RTI portal dropdown — a mismatch causes the auto-selection to fail.
- `getMinistry(category)` — returns the ministry for a given category.
- `getAllMinistries()` — returns all distinct ministry names (used by the frontend dropdown).

### 7.2 Ministry Selection Endpoint

**Route:** `GET /api/rti-portal/ministries?category=Education`

**Controller (`rtiPortalController.js`):**
```js
const getMinistries = async (req, res) => {
  const { category } = req.query;
  res.json({
    suggested: category ? getMinistry(category) : null,
    ministries: getAllMinistries(),
  });
};
```
- Returns a `suggested` ministry based on the complaint category, plus the full list so the user can override if needed.

---

## 8. Layer 5 — Submission & Verification

**What this layer does:** Automates the multi-step rtionline.gov.in form submission using Puppeteer, handling CAPTCHA and OTP via human-in-the-loop interaction.

### 8.1 Why Puppeteer?

rtionline.gov.in has no public API. The only way to submit is through its web form. Puppeteer launches a real Chromium browser, interacts with form elements exactly as a human would, and handles the multi-step flow. `headless: false` keeps the browser window visible so the user can solve the CAPTCHA and enter the OTP themselves.

### 8.2 The 6-Step Submission Flow

**File:** `backend/services/rtiPortal/index.js` (orchestrator)
**File:** `backend/services/rtiPortal/rtionlineAdapter.js` (page interactions)

```
Step 1+2: Navigate → Accept Guidelines
  adapter.acceptGuidelines(page)
  - Goes to rtionline.gov.in
  - Clicks "Submit Request"
  - Checks "I have read and understood" checkbox
  - Clicks Submit

Step 3: Fill Email + Phone → Wait for User CAPTCHA
  adapter.fillEmailAndWaitForCaptcha(page, email, phone)
  - Types email into #Email
  - Types phone into #cell
  - Waits up to 3 minutes for user to solve CAPTCHA and click Submit
  - Resolves when page navigates to OTP page

Step 4: Wait for User OTP
  adapter.waitForOTPVerification(page)
  - Waits up to 5 minutes for user to enter OTP
  - Resolves when page navigates to RTI form

Step 5: Auto-fill RTI Form
  adapter.fillRTIForm(page, { ministry, name, gender, address, pincode, state, phone, email, rtiText, isBPL })
  - Selects Ministry from #MinistryId dropdown
  - Waits for #DepartmentId to populate via AJAX (polls 7 times × 500ms)
  - Fills name, gender radio, 3-part address, pincode, state dropdown
  - Fills RTI text in #Description (sanitized, max 3000 chars)
  - Sets BPL radio button

Step 6: Capture Payment URL
  adapter.submitAndCapturePaymentUrl(page)
  - Waits up to 10 minutes for user to solve CAPTCHA and click "Make Payment"
  - Captures the resulting payment page URL
  - Saves URL to DB as paymentLink
```

### 8.3 Key Adapter Techniques

**Dropdown selection by partial text (`selectByText`):**
```js
async function selectByText(page, selector, targetText) {
  return page.evaluate((sel, text) => {
    const keywords = text.toLowerCase().split(' ').filter(w => w.length > 3);
    let best = null, bestScore = 0;
    for (const opt of el.options) {
      const score = keywords.filter(k => opt.text.toLowerCase().includes(k)).length;
      if (score > bestScore) { bestScore = score; best = opt; }
    }
    if (best) { el.value = best.value; el.dispatchEvent(new Event('change', { bubbles: true })); }
  }, selector, targetText);
}
```
- **Why partial match?** The portal dropdown text may not exactly match our ministry string. Splitting into words and scoring each option finds the best match even with minor wording differences.
- **`dispatchEvent('change')`** — Required to trigger the portal's JavaScript event listeners (like the AJAX call that populates the Public Authority dropdown). Simply setting `.value` does not fire these events.

**Address splitting (`splitAddress`):**
```js
function splitAddress(address) {
  const parts = ['', '', ''];
  let p = 0;
  for (const w of words) {
    if (parts[p].length + w.length + 1 > 60 && p < 2) p++;
    parts[p] += (parts[p] ? ' ' : '') + w;
  }
  return parts;
}
```
- The RTI portal has three address fields (`#address1`, `#address2`, `#address3`), each limited to ~60 characters. This function splits the full address word-by-word into the three parts without cutting words mid-word.

**Text sanitization (`sanitizeRTIText`):**
```js
function sanitizeRTIText(text) {
  return text.replace(/[^A-Za-z0-9 ,.\-_()\/@:&\\?%\n]/g, ' ')
             .replace(/ {2,}/g, ' ').trim();
}
```
- The portal only accepts a limited character set. Unicode characters, emojis, curly quotes, and special symbols cause form validation to fail. This regex removes all non-allowed characters.

### 8.4 AES-256 Credential Encryption

**File:** `backend/services/rtiPortal/credentialService.js`
```js
const CryptoJS = require('crypto-js');
const SECRET = process.env.RTI_CRED_SECRET || 'sentinel_rti_default_secret_change_me';

function encrypt(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, SECRET).toString();
}
function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```
- **Why encrypt?** RTI portal credentials are sensitive. Storing them in plain text in MongoDB would be a security risk. AES-256 ensures even if the DB is compromised, credentials are unreadable without the secret key.
- **`RTI_CRED_SECRET`** is stored only in the `.env` file, which is git-ignored.
- The encrypted strings are stored in `user.rtiPortalCredentials.username` and `.password`, both with `select: false` in the Mongoose schema — they are never returned in normal queries.

### 8.5 Session Management

**File:** `backend/services/rtiPortal/index.js`
```js
const activeSessions = new Map(); // complaintId → { browser }
```
- After submission reaches the payment page, the browser stays open and its reference is stored in `activeSessions`.
- When the user later calls `checkRegistration`, the same browser session can be reused to check the RTI status page — avoiding a fresh login.
- On server shutdown (SIGINT/SIGTERM), `cleanupAllSessions()` closes all open browser instances gracefully.

### 8.6 Fire-and-Forget Async Pattern

**Controller (`rtiPortalController.js`):**
```js
// 1. Respond immediately (HTTP 202 Accepted)
res.status(202).json({ success: true, message: 'RTI submission started...' });

// 2. Run automation in background — does NOT block the HTTP response
rtiPortalService.submitToRTIPortal({ complaint, user, ... })
  .then(result => { if (!result.success) console.error(...); });
```
- **Why `202 Accepted`?** The Puppeteer flow can take 5–15 minutes (waiting for human CAPTCHA + OTP). An HTTP request cannot stay open that long — it would time out. By responding immediately with 202 and running the automation in the background, the API stays responsive.
- The frontend polls `GET /api/rti-portal/status/:complaintId` to check progress.


---

## 9. Layer 6 — Lifecycle Tracking

**What this layer does:** Every complaint moves through statuses (submitted → pending → escalated → resolved) with a full timeline of events stored in MongoDB.

### 9.1 Status Flow

```
submitted  →  pending  →  escalated  →  resolved
    ↑                          |
    └──────────────────────────┘  (can revert or skip steps)
```

| Status | Meaning |
|---|---|
| `submitted` | Complaint filed, waiting for authority response |
| `pending` | Under review, response overdue |
| `escalated` | Passed to First Appellate Authority or CIC |
| `resolved` | Information received / complaint closed |

### 9.2 Timeline Sub-document

**File:** `backend/models/Complaint.js`
```js
const timelineEventSchema = new mongoose.Schema({
  date:   { type: Date, default: Date.now },
  event:  { type: String, required: true },
  status: { type: String, enum: ['submitted','pending','escalated','resolved'] },
}, { _id: false });
```
- **`{ _id: false }`** — Mongoose by default adds an `_id` to every sub-document. Disabling it saves storage since timeline events don't need their own IDs.
- Every status change pushes a new event into `complaint.timeline[]`.

### 9.3 Status Update Endpoint

**Controller (`complaintController.js`):**
```js
const updateComplaintStatus = async (req, res) => {
  const { status, event } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  complaint.status = status;
  complaint.timeline.push({
    date:   new Date(),
    event:  event || `Status changed to ${status}`,
    status,
  });
  await complaint.save();
};
```
- **Route:** `PATCH /api/complaints/:id/status`
- Accepts a `status` and optional human-readable `event` description.
- Both fields are pushed simultaneously — the status field for quick filtering, the timeline for full audit history.

### 9.4 RTI Portal Submission Status

Inside `complaint.rtiPortalSubmission`:
```
not_submitted → in_progress → pending_payment → submitted
                    ↓
                  failed
```
- `in_progress` — Puppeteer automation has started
- `pending_payment` — User reached the payment page; payment not yet confirmed
- `submitted` — Registration number retrieved after payment confirmed
- `failed` — Automation error; `errorMessage` field stores the reason

---

## 10. Layer 7 — Automated Follow-Ups

**What this layer does:** Schedules future reminders, appeal deadlines, and escalation dates at the time of complaint submission.

### 10.1 Follow-Up Schema

**File:** `backend/models/Complaint.js`
```js
const followUpSchema = new mongoose.Schema({
  type:        { type: String, enum: ['reminder','appeal','escalation'] },
  scheduledAt: { type: Date, required: true },
  sentAt:      { type: Date },
  status:      { type: String, enum: ['pending','sent','skipped'], default: 'pending' },
}, { _id: false });
```

### 10.2 Schedule Generation

**File:** `backend/controllers/complaintController.js`
```js
function scheduleFollowUps(filedDate) {
  const base = new Date(filedDate);
  return [
    { type: 'reminder',   scheduledAt: base + 7  days, status: 'pending' },
    { type: 'reminder',   scheduledAt: base + 15 days, status: 'pending' },
    { type: 'appeal',     scheduledAt: base + 30 days, status: 'pending' },
    { type: 'escalation', scheduledAt: base + 60 days, status: 'pending' },
  ];
}
```

| Follow-Up | When | Why |
|---|---|---|
| Reminder 1 | Day 7 | Notify user complaint is under review |
| Reminder 2 | Day 15 | Mid-point check — response overdue warning |
| Appeal | Day 30 | RTI Act Section 19(1) deadline — file First Appeal |
| Escalation | Day 60 | If First Appeal unresolved — escalate to CIC |

- **Why Day 30 for appeal?** The RTI Act mandates a 30-day response window. If no response by Day 30, the applicant has grounds for a First Appeal under Section 19(1).
- **Why Day 60 for escalation?** The First Appellate Authority has 30 more days to respond. By Day 60, if still unresolved, the matter can go to the Central/State Information Commission.
- These dates are stored in the DB. A background job (or future cron) can query `followUps` where `scheduledAt <= now` and `status === 'pending'` to send actual email/SMS reminders.

---

## 11. Layer 8 — Escalation Engine

**What this layer does:** Uses the follow-up data to trigger escalation actions — filing appeals, contacting higher authorities, or notifying the CIC.

Currently, the escalation engine is implemented at the **data model** level (the `followUps` array in every complaint). The escalation types are:

| Type | Description | Legal Basis |
|---|---|---|
| `reminder` | Sends user a status update | Internal |
| `appeal` | Prompts user to file First Appeal | RTI Act Section 19(1) |
| `escalation` | Prompts user to approach CIC/SIC | RTI Act Section 19(3) |

The escalation workflow is queryable via the dashboard stats endpoint which counts `escalated` status complaints. Future iterations can add a cron job:

```js
// Pseudocode for future cron job
const due = await Complaint.find({
  'followUps.status': 'pending',
  'followUps.scheduledAt': { $lte: new Date() }
});
// → send notification → mark followUp.status = 'sent'
```

---

## 12. Layer 9 — Analytics Dashboard

**What this layer does:** Provides aggregated statistics about all complaints — counts by status, category, severity, monthly trends, and authority performance.

### 12.1 Dashboard Stats Endpoint

**File:** `backend/controllers/dashboardController.js`
**Route:** `GET /api/dashboard/stats`

```js
const getDashboardStats = async (req, res) => {
  const totalComplaints = await Complaint.countDocuments();
  const resolved = await Complaint.countDocuments({ status: 'resolved' });
  const resolutionRate = ((resolved / totalComplaints) * 100).toFixed(1);

  // By category — MongoDB aggregation pipeline
  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Monthly trend — last 6 months
  const monthlyTrend = await Complaint.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        filed: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status','resolved'] }, 1, 0] } },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Top 5 authorities by complaint volume
  const topAuthorities = await Complaint.aggregate([
    { $group: {
        _id: '$authority',
        total:    { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status','resolved'] }, 1, 0] } },
        pending:  { $sum: { $cond: [{ $ne: ['$status','resolved'] }, 1, 0] } },
    }},
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);
};
```

**Why MongoDB aggregation pipelines?**
- `$group` + `$sum` replaces multiple individual `countDocuments()` calls with a single DB round-trip.
- `$cond` inside `$sum` acts like a conditional counter — counts only documents matching a condition.
- `$match` on `createdAt` limits the monthly trend scan to the last 6 months — avoids scanning the entire collection.
- Aggregations run inside MongoDB's engine, which is far faster than fetching all documents to Node.js and counting in JS.

**Response shape:**
```json
{
  "overview":         { "totalComplaints", "resolutionRate", "avgResponseTime", "activeEscalations" },
  "byStatus":         { "submitted", "pending", "escalated", "resolved" },
  "byCategory":       [ { "category", "count", "pct" } ],
  "bySeverity":       [ { "severity", "count" } ],
  "monthlyTrend":     [ { "month", "filed", "resolved" } ],
  "topAuthorities":   [ { "name", "resolved", "pending", "rate" } ],
  "recentComplaints": [ last 10 complaints ]
}
```


---

## 13. Database Models

### 13.1 User Model (`backend/models/User.js`)

```js
const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true, match: /regex/ },
  password: { type: String, minlength: 6, select: false },  // never returned in queries
  phone:    String,
  gender:   { type: String, enum: ['M','F','O'] },
  address:  String,
  pincode:  String,
  state:    String,
  isBPL:    Boolean,
  rtiPortalCredentials: {
    username: { type: String, select: false },  // AES-256 encrypted
    password: { type: String, select: false },  // AES-256 encrypted
    savedAt:  Date,
  },
}, { timestamps: true });
```

**Pre-save hook (password hashing):**
```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```
- `bcrypt.genSalt(10)` — generates a random salt with cost factor 10. Higher cost = more secure but slower hashing. 10 is the industry standard for web applications.
- `this.isModified('password')` — prevents re-hashing an already hashed password when other fields are updated.

**Instance method:**
```js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
- `bcrypt.compare` handles the salt automatically — no need to manually extract it.
- `select: false` on the password field means it is excluded from all queries by default. The auth controller explicitly opts in with `.select('+password')`.

**Why `select: false` on credentials?**
RTI portal credentials are especially sensitive. Even internal queries that return user data will never accidentally expose these fields unless explicitly requested with `+rtiPortalCredentials.username`.

---

### 13.2 Complaint Model (`backend/models/Complaint.js`)

The Complaint document is the central data object of the entire system:

| Field | Type | Purpose |
|---|---|---|
| `trackingId` | String, unique | Human-readable ID e.g. `SRT-2026-1001` |
| `description` | String | The complaint text |
| `category` | Enum (9 values) | Classified issue type |
| `inputMode` | Enum | How the complaint was entered |
| `location` | String | Place name |
| `geoCoords` | `{lat, lng}` | GPS coordinates |
| `imageUrl` | String | URL to uploaded evidence photo |
| `voiceTranscript` | String | Browser speech-to-text output |
| `legalDraft` | String | Generated RTI application text |
| `status` | Enum | Current lifecycle status |
| `severity` | Enum | LOW / MEDIUM / HIGH |
| `authority` | String | Assigned government department |
| `timeline` | Array | Event log of all status changes |
| `aiProcessing` | Object | Full AI analysis result |
| `followUps` | Array | Scheduled reminders/appeals |
| `submissionVerification` | Object | OTP/CAPTCHA verification flags |
| `rtiPortalSubmission` | Object | Portal submission status & registration number |

**Auto-generate tracking ID (pre-validate hook):**
```js
const count = await mongoose.model('Complaint').countDocuments();
this.trackingId = `SRT-${year}-${String(count + 1001).padStart(4, '0')}`;
```
- Starts IDs from 1001 (not 0001) so they look like real government reference numbers.
- `padStart(4, '0')` ensures IDs are always 4 digits: `SRT-2026-1001`, `SRT-2026-1002`, etc.

---

### 13.3 Contact Model (`backend/models/Contact.js`)

Simple schema for the contact form:
```js
{ name, email, issueType (enum 7 values), message, timestamps }
```
- `issueType` enum: `RTI Filing Assistance`, `Complaint Escalation`, `Technical Support`, `Legal Query`, `Partnership Inquiry`, `Media / Press`, `Other`
- All fields required except `issueType` defaults to `'Other'`.

---

## 14. API Reference

### Authentication — `/api/auth`

| Method | Route | Access | What it does |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Creates user account, returns JWT |
| POST | `/api/auth/login` | Public | Validates credentials, returns JWT |
| GET | `/api/auth/me` | Private | Returns logged-in user profile |

### Complaints — `/api/complaints`

| Method | Route | Access | What it does |
|---|---|---|---|
| POST | `/api/complaints/analyze` | Public | Runs AI analysis, no DB save |
| POST | `/api/complaints` | Public | Submits complaint, saves to DB |
| GET | `/api/complaints` | Public | Lists all complaints (max 50) |
| GET | `/api/complaints/search?trackingId=` | Public | Find by tracking ID |
| GET | `/api/complaints/:id` | Public | Get single complaint by MongoDB ID |
| PATCH | `/api/complaints/:id/status` | Public | Update status + timeline |

### Dashboard — `/api/dashboard`

| Method | Route | What it does |
|---|---|---|
| GET | `/api/dashboard/stats` | Returns full analytics aggregation |

### RTI Portal — `/api/rti-portal`

| Method | Route | What it does |
|---|---|---|
| POST | `/api/rti-portal/credentials/:userId` | Save encrypted RTI credentials |
| GET | `/api/rti-portal/credentials/:userId` | Check if credentials exist |
| POST | `/api/rti-portal/submit/:complaintId` | Start Puppeteer automation |
| GET | `/api/rti-portal/status/:complaintId` | Poll submission status |
| POST | `/api/rti-portal/check-registration/:complaintId` | Retrieve registration number |
| GET | `/api/rti-portal/ministries?category=` | List all ministries |

### Contact — `/api/contact`

| Method | Route | What it does |
|---|---|---|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | Get all contact submissions |

---

## 15. Authentication & Security

### 15.1 JWT Flow

**File:** `backend/controllers/authController.js`
```js
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET || 'secret123',
  { expiresIn: '30d' }
);
```
- `jwt.sign` creates a signed token containing the user ID.
- `expiresIn: '30d'` — tokens expire after 30 days, reducing the window if a token is stolen.
- The token is returned to the frontend, which stores it (typically in `localStorage`) and sends it in every subsequent request.

### 15.2 Auth Middleware

**File:** `backend/middleware/authMiddleware.js`
```js
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  }
  if (!token) res.status(401).json({ error: 'Not authorized, no token' });
};
```
- Reads the `Authorization: Bearer <token>` header.
- `jwt.verify` validates the token signature AND checks expiry — throws an error if either fails.
- `req.user` is populated with the full user object (minus password) so controllers can access `req.user.id`, `req.user.name`, etc.
- Applied to routes that need protection: `GET /api/auth/me`.

### 15.3 Admin Seeding

**File:** `backend/server.js`
```js
const seedAdmin = async () => {
  const adminExists = await User.findOne({ email: 'admin@sentinel.com' });
  if (!adminExists) {
    await User.create({ name: 'Super Admin', email: 'admin@sentinel.com', password: 'admin123' });
  }
};
seedAdmin();
```
- Runs on every server startup. Only creates the admin if it doesn't already exist — safe to run repeatedly.
- The password goes through the Mongoose pre-save hook, so it is bcrypt-hashed in the DB.

---

## 16. RTI Legal Knowledge Base

**(Full documentation in Section 6.2 above)**

**File:** `backend/services/ai/rtiLegalKnowledge.js`

Summary of exported helper functions:

```js
// Full context — all sections, fees, timelines, appeals
getLegalContextForPrompt({
  includeFees:      true,   // include Rs.10 fee structure
  includeTimelines: true,   // include 30-day, 48-hour rules
  includeAppeals:   true,   // include Section 19 and appeal grounds
  sections: ['Section 6', 'Section 7', ...] // which sections to include
})

// Lightweight version — used in draftGenerator.js
getEssentialLegalContext()
// Returns: Sections 3, 6, 7, 8, 19, 20 + fees + timelines
// ~2000 characters — token-efficient for Gemini prompts
```

---

## 17. Frontend Architecture

### 17.1 State Management — No External Library

**File:** `src/App.jsx`

The app uses React's built-in `useState` for all state:
- `page` state string controls which page renders — no React Router, no Redux.
- The `navigate(p)` function is passed as a prop through the component tree.
- This is deliberately simple — the app has 3 pages and minimal shared state.

### 17.2 Navbar Component

**File:** `src/components/Navbar.jsx`

The Navbar adapts its visual style to the current page using a `styles` object:
```js
const styles = {
  home:    { bg: 'rgba(7,9,15,0.90)', ... },  // dark glass
  about:   { bg: 'rgba(253,248,242,0.95)', ...}, // warm parchment
  contact: { bg: 'rgba(255,255,255,0.95)', ...}, // clean white
};
const s = styles[page]; // pick the current page's style set
```
- `backdropFilter: blur(18px)` — creates the glassmorphism blur effect on the sticky nav.
- The hamburger menu (`mobile-menu-btn`) is hidden by default via inline CSS and shown at `max-width: 700px` via a `<style>` tag injected inside the component.
- Logo font changes per page: `Syne` (home), `Playfair Display` (about), loaded from Google Fonts.

### 17.3 Pages

| File | Purpose |
|---|---|
| `src/pages/Home.jsx` | Main complaint form — all 4 input modes, AI analysis display, submission |
| `src/pages/About.jsx` | Project description, team, RTI Act information |
| `src/pages/Contact.jsx` | Contact form — posts to `/api/contact` |

### 17.4 Vite Proxy

**File:** `vite.config.js`

```js
server: {
  proxy: { '/api': 'http://localhost:5000' }
}
```
- All requests to `/api/...` from the frontend are proxied to the backend on port 5000.
- This eliminates CORS issues during development and means the frontend never hardcodes the backend URL.

---

## 18. Environment Variables

**File:** `backend/.env` (git-ignored)

| Variable | Purpose | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key_32chars` |
| `PORT` | Backend server port | `5000` |
| `GEMINI_API_KEY1` | First Gemini API key | `AIza...` |
| `GEMINI_API_KEY2` | Second Gemini key (rotation) | `AIza...` |
| `GEMINI_API_KEY3` | Third Gemini key (rotation) | `AIza...` |
| `GEMINI_API_KEY4` | Fourth Gemini key (rotation) | `AIza...` |
| `RTI_CRED_SECRET` | AES-256 key for credential encryption | `change_this_to_random_32_chars` |

**Why multiple Gemini keys?**
The free Gemini tier has a rate limit of ~15 requests/minute. Multiple keys allow the system to rotate and handle concurrent users without hitting quota limits.

---

## 19. How to Run the Project

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- At least one Google Gemini API key (free at ai.google.dev)

### Setup Steps

```bash
# 1. Install all dependencies
npm run install-all

# 2. Create the backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env and fill in:
# MONGODB_URI, JWT_SECRET, GEMINI_API_KEY1, RTI_CRED_SECRET

# 3. Start both servers simultaneously
npm run dev
# Backend:  http://localhost:5000
# Frontend: http://localhost:5173

# 4. Health check
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "message": "Sentinel-RTI Backend is running 🚀" }

# 5. Default admin login
# Email:    admin@sentinel.com
# Password: admin123
```

### Individual Server Commands

```bash
# Backend only
cd backend && npm run dev    # nodemon watches for changes

# Frontend only
cd frontend && npm run dev   # Vite hot-reloads on save
```

### Production Build

```bash
cd frontend && npm run build  # outputs to frontend/dist/
```

---

*Documentation generated for Sentinel-RTI v1.0 — April 2026*

