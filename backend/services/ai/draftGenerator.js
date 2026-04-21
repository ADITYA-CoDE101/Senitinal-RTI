'use strict';

/**
 * ai/draftGenerator.js
 * RTI application draft generator.
 * Identical prompt, model list, key rotation, and fallback template as original aiService.js generateRTIDraft().
 */

const { callGemini }             = require('./geminiClient');
const { KEYS }                   = require('./config');
const { getEssentialLegalContext, TIMELINES, FEE_STRUCTURE } = require('./rtiLegalKnowledge');

// ── Per-category RTI information requests (unchanged) ─────────────
const CATEGORY_QUESTIONS = {
  'Road & Infrastructure': [
    'the current status of the repair or maintenance work sanctioned for the above-mentioned site',
    'copies of field inspection reports, engineering assessments, or joint surveys conducted at this location in the past 12 months',
    'details of the budget allocated and actual expenditure incurred for road/infrastructure maintenance at this location during the current and previous financial year',
    'the names, designations, and contact details of the officers directly responsible for maintenance and oversight of this specific area',
  ],
  'Water & Sanitation': [
    'the latest water quality test reports and sewer inspection logs for this locality, including dates of testing',
    'the scheduled frequency of maintenance for water supply and sanitation infrastructure in this ward, and records of actual maintenance carried out in the past 6 months',
    'details of any pending work orders, sanctioned estimates, or repair approvals related to the issue described above',
    'the names and designations of the junior engineer and the contractor responsible for water and sanitation works in this ward',
  ],
  'Electricity & Power': [
    'a complete record of power outages, low voltage complaints, and transformer failures logged for this area in the past 6 months',
    'details of any pending or sanctioned work for transformer replacement, cable upgradation, or streetlight repair in this locality',
    'the status of any maintenance requests or complaints previously lodged for this specific location',
    'the name, designation, and contact details of the Assistant Engineer (Electrical) responsible for this area',
  ],
  'Healthcare': [
    'a complete stock register of essential medicines available at the concerned health facility as on the date of this application',
    'the duty roster of medical officers and paramedical staff assigned to this facility for the current month, along with attendance records for the past 3 months',
    'details of the annual budget allocated for medicines, equipment, and infrastructure maintenance at this facility and utilisation thereof',
    "the current status of the Citizen's Charter displayed at this facility and the mechanism available for grievance redressal",
  ],
  'Education': [
    'the current teacher-student ratio at the named institution and details of sanctioned versus actual teaching posts filled',
    'details of funds received and utilised under Samagra Shiksha Abhiyan or any other government scheme for this institution in the past two financial years',
    'a copy of the most recent building safety audit or infrastructure inspection report for this school',
    'records related to mid-day meal provision, including quality inspection reports and attendance records for the current academic quarter',
  ],
  'Municipal Services': [
    'the official schedule of garbage collection, street sweeping, and sanitation services for this ward',
    'records of sanitation staff deployed in this area for the past 3 months, including their daily attendance',
    'details of the budget sanctioned and spent on cleanliness and solid waste management in this ward during the current financial year',
    'the total number of civic complaints received regarding this ward in the past 6 months and the action taken on each',
  ],
  'Land & Property': [
    'a certified copy of the land records, Khasra, Khatauni, or registry documents pertaining to the plot or property mentioned',
    'details of any encroachment notices issued or legal proceedings initiated with respect to this property',
    'copies of any orders, letters, or correspondence from the Revenue Department pertaining to this matter in the past 3 years',
    'the name and designation of the Patwari, Lekhpal, or Revenue Inspector responsible for this Khasra number or survey plot',
  ],
  'Public Transport': [
    'the official timetable and route details for the bus or transport service mentioned, including the sanctioned frequency of trips',
    'records of complaints received about this route or service in the past 3 months and the action taken',
    'details of the contract or agreement under which this transport service is operated, including the name of the contractor or operator',
    'the name and designation of the officer responsible for monitoring compliance on this transport route',
  ],
  'Environment': [
    'copies of ambient air quality, water quality, or noise level monitoring reports for this area conducted in the past 6 months',
    'details of any show-cause notices, closure orders, or directions issued to polluting units in this vicinity',
    'the current status of action taken by the concerned authority on any earlier complaints filed regarding this matter',
    'the name and designation of the Environment Inspector or Pollution Control Officer responsible for monitoring this area',
  ],
};
const DEFAULT_QUESTIONS = CATEGORY_QUESTIONS['Road & Infrastructure'];

// ── Rule-based template (identical to original rulesBasedDraft) ───
function rulesBasedDraft(data, ai) {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const yearAgo = new Date(now); yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const fromStr = yearAgo.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const category    = ai?.category  || data.category || 'Other';
  const authority   = ai?.authority || 'The Concerned Public Authority';
  const location    = data.location || 'the location described herein';
  const description = (data.description || data.voiceTranscript || '').trim();
  const questions   = CATEGORY_QUESTIONS[category] || DEFAULT_QUESTIONS;

  const firstSentence = description.split(/[.!?]/)[0].trim();
  const restOfDesc    = description.slice(firstSentence.length).replace(/^[.!?\s]+/, '').trim();

  return `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO),
${authority},
[Concerned Government Department / Office],
Government of India / State Government.

Date: ${dateStr}
Place: ${location}

Subject: Request for Information under Section 6(1) of the Right to Information Act, 2005 — regarding ${category} issue at ${location}.

Respected Sir / Madam,

I am a citizen of India and I wish to bring to your kind attention a serious matter concerning ${category.toLowerCase()} in the area of ${location}. ${firstSentence}.${restOfDesc ? ' ' + restOfDesc : ''}

Despite the evident public impact of this issue, no satisfactory resolution has been forthcoming. I am therefore constrained to seek information under the provisions of the Right to Information Act, 2005 in order to understand the status of action taken by the competent authority.

Accordingly, I hereby request the following specific information under Section 6(1) of the RTI Act, 2005:

${questions.map((q, i) => `${i + 1}. Kindly furnish ${q}.`).join('\n\n')}

${data.geoCoords || data.geoLat ? `The specific location of the issue is at coordinates: ${data.geoLat ? `Lat. ${parseFloat(data.geoLat).toFixed(6)}°N, Long. ${parseFloat(data.geoLng).toFixed(6)}°E` : data.location}.` : ''}

The information sought pertains to the period from ${fromStr} to ${dateStr}.

I wish to state that the information sought does not fall within the exemptions contained in Sections 8 and 9 of the RTI Act, 2005, and that to the best of my knowledge, it pertains to your public authority.

I am prepared to pay the prescribed application fee of Rs. 10/- (Rupees Ten only) as stipulated under the RTI Act. Kindly acknowledge receipt of this application and provide the requested information within the statutory period of thirty (30) days as mandated under Section 7(1) of the RTI Act, 2005.

Should the information not be provided within the stipulated time, or if I am dissatisfied with the response, I reserve my right to prefer a first appeal under Section 19(1) of the RTI Act, 2005, and thereafter approach the Central / State Information Commission as the case may be.

Thanking you,

Yours faithfully,

Name    : [Applicant Name]
Address : ${location}
Date    : ${dateStr}

Enclosures:
  1. Prescribed RTI fee (Rs. 10/-)${data.imageUrl ? '\n  2. Photographic evidence (attached)' : ''}
`;
}

// ── AI-powered draft (identical prompt + model list as original) ──
async function generateRTIDraft(data, ai) {
  if (!KEYS.length) return rulesBasedDraft(data, ai);

  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const yearAgo = new Date(now); yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const fromStr = yearAgo.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const category    = ai?.category  || data.category || 'Other';
  const authority   = ai?.authority || 'The Concerned Public Authority';
  const location    = data.location || 'the location described';
  const description = (data.description || data.voiceTranscript || '').trim();
  const severity    = ai?.severity  || 'MEDIUM';
  const hasGeo      = !!(data.geoLat || data.geoCoords?.lat);
  const hasImage    = !!(data.imageFile || data.imageUrl);

  // ── Inject static legal knowledge (replaces RAG) ──
  const legalContext = getEssentialLegalContext();

  const prompt = `You are a senior Indian legal expert and RTI (Right to Information) practitioner with 20 years of experience drafting RTI applications for Indian citizens.

The following is the authoritative legal reference from the Right to Information Act, 2005. Use it to ensure your draft is legally accurate:

${legalContext}

Write a complete, formal RTI application based on the following complaint. The application must:
- Be written entirely in the voice of a concerned Indian citizen — first person, formal, dignified
- Follow the exact format of an authentic RTI application under the RTI Act, 2005
- Sound completely natural and human — NO robotic phrasing, no lists of metadata, no technical labels
- Include all standard RTI legal elements: proper address block, subject line, detailed description, numbered information requests (at least 4), reference period, fee statement (Rs. 10/- as per RTI Fee Rules), appeal warning citing Section 19(1), and sign-off
- The specific information requested must be precise, legally sound, and directly relevant to the complaint
- Use professional Indian legal English (similar to how a practising advocate would draft it)
- CRITICAL: Do NOT include any AI references, system names, tracking codes, confidence scores, or any technical metadata whatsoever
- The document should read as if typed by the applicant on a typewriter and posted to the PIO

Complaint Details:
- Category: ${category}
- Issue Description: "${description}"
- Location: ${location}
- Severity: ${severity}
- Physical evidence available: ${hasImage ? 'Yes (photograph enclosed)' : 'No'}
- GPS location tagged: ${hasGeo ? `Yes (Lat: ${data.geoLat}, Long: ${data.geoLng})` : 'No'}
- Authority to address: ${authority}
- Date: ${dateStr}
- Reference period: ${fromStr} to ${dateStr}

Write ONLY the RTI application text. No introduction, no explanation, no commentary before or after. Start directly with "APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005".`;

  // ── IDENTICAL generationConfig and TEXT_MODELS as original ──
  const draft = await callGemini(prompt, {
    label:            'RTI Draft',
    generationConfig: { temperature: 0.4, maxOutputTokens: 1800 },
  });

  if (draft) {
    console.log(`📝 RTI draft written by ${draft.length} chars)`);
    return draft;
  }

  console.log('📝 RTI draft: all Gemini models exhausted — using rule-based template');
  return rulesBasedDraft(data, ai);
}

module.exports = { generateRTIDraft, rulesBasedDraft, CATEGORY_QUESTIONS };
