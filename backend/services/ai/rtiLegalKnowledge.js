'use strict';

/**
 * rtiLegalKnowledge.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Static knowledge base of the Right to Information Act, 2005 (India).
 * No RAG / vector DB required — import and inject directly into AI prompts
 * or use programmatically in rule-based logic.
 *
 * Sources:
 *   • Right to Information Act, 2005 (No. 22 of 2005), Government of India
 *   • Central Information Commission Rules, 2006
 *   • RTI (Fee & Cost) Rules, 2005
 *   • CIC Decisions & DOPT Circulars (up to 2024)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── PART 1: Act Overview ────────────────────────────────────────────────────

const ACT_OVERVIEW = `
RIGHT TO INFORMATION ACT, 2005 — OVERVIEW
==========================================
Full Title  : The Right to Information Act, 2005 (Act No. 22 of 2005)
Enacted     : 15 June 2005
In Force    : 13 October 2005 (120 days after enactment)
Applicability: All States and Union Territories of India, except Jammu & Kashmir
               (J&K has its own J&K RTI Act, 2009)
Objective   : To provide a practical regime for citizens to secure access to
              information under the control of public authorities, to promote
              transparency and accountability in the working of every public
              authority.
`;

// ─── PART 2: Key Definitions (Section 2) ────────────────────────────────────

const DEFINITIONS = {
  'Information': `
    Section 2(f): "Information" means any material in any form, including records,
    documents, memos, e-mails, opinions, advices, press releases, circulars, orders,
    logbooks, contracts, reports, papers, samples, models, data material held in any
    electronic form, and information relating to any private body which can be accessed
    by a public authority under any other law for the time being in force.`,

  'Public Authority': `
    Section 2(h): "Public authority" means any authority or body or institution of
    self-government established or constituted—
    (a) by or under the Constitution;
    (b) by any other law made by Parliament;
    (c) by any other law made by State Legislature;
    (d) by notification issued or order made by the appropriate Government,
    and includes any—
    (i)  body owned, controlled or substantially financed;
    (ii) non-Government organisation substantially financed, directly or indirectly
         by funds provided by the appropriate Government.`,

  'Record': `
    Section 2(i): "Record" includes—
    (a) any document, manuscript and file;
    (b) any microfilm, microfiche, and facsimile copy of a document;
    (c) any reproduction of image or images embodied in such microfilm; and
    (d) any other material produced by a computer or any other device.`,

  'Right to Information': `
    Section 2(j): "Right to information" means the right to information accessible
    under this Act which is held by or under the control of any public authority and
    includes the right to—
    (i)   inspection of work, documents, records;
    (ii)  taking notes, extracts, or certified copies of documents or records;
    (iii) taking certified samples of material;
    (iv)  obtaining information in the form of diskettes, floppies, tapes, video
          cassettes or in any other electronic mode or through printouts where such
          information is stored in a computer or in any other device.`,

  'Public Information Officer (PIO)': `
    Section 2(l): The officer designated by a public authority to deal with RTI
    requests. Every public authority must designate a Central Public Information
    Officer (CPIO) or State Public Information Officer (SPIO) to provide
    information to citizens who request it.`,

  'Appellate Authority': `
    Section 2(a): An officer senior in rank to the PIO within the same public
    authority, designated to hear first appeals under Section 19(1).`,
};

// ─── PART 3: How to File an RTI Application ─────────────────────────────────

const FILING_PROCEDURE = `
HOW TO FILE AN RTI APPLICATION
================================

1. IDENTIFY THE PUBLIC AUTHORITY
   - Determine which public authority holds the information you need.
   - File with the PIO of that specific department/ministry/office.
   - If unsure, you may file with a public authority you believe holds it;
     they are obligated to transfer it (Section 6(3)).

2. WRITE THE APPLICATION
   - Can be written in English, Hindi, or the official language of the area.
   - Address it to: The Public Information Officer (PIO), [Name of Office].
   - Clearly state the specific information sought.
   - You are NOT required to give reasons for seeking information (Section 6(2)).
   - Keep it factual and specific — avoid vague or sweeping requests.

3. PAY THE APPLICATION FEE
   - Central Government offices: Rs. 10/- (non-BPL applicants)
   - Mode: Cash / Demand Draft / Banker's Cheque / Indian Postal Order (IPO)
   - BPL (Below Poverty Line) card holders: NO FEE (Section 7(5))
   - Proof of BPL status must be enclosed if claiming exemption.
   - State governments may have different fee rules (check locally).

4. SUBMIT THE APPLICATION
   - In person at the PIO's office (get dated acknowledgement receipt).
   - By registered post / speed post.
   - Online via rtionline.gov.in (for Central Government departments).
   - By e-mail where the authority permits electronic filing.

5. TRACK THE APPLICATION
   - Keep a copy of the application and proof of submission.
   - Note the date of submission — the 30-day clock starts from this date.
`;

// ─── PART 4: Critical Sections of the Act ───────────────────────────────────

const KEY_SECTIONS = {
  'Section 3': {
    title: 'Right to Information for Citizens',
    text: `All citizens shall have the right to information. (Note: Only Indian
    citizens have this right — not companies, NGOs, or associations — though
    an individual citizen can seek information on behalf of an organisation.)`,
  },
  'Section 4': {
    title: 'Obligations of Public Authorities (Suo Motu Disclosure)',
    text: `Every public authority shall maintain all its records duly catalogued and
    indexed. It shall proactively publish:
    (a) particulars of its organisation, functions, duties;
    (b) powers and duties of its officers;
    (c) procedure for decision-making, including channels of supervision;
    (d) norms set for the discharge of its functions;
    (e) rules, regulations, instructions, manuals and records;
    (f) categories of documents held;
    (g) arrangements for consultation with the public;
    (h) boards, councils, committees — their composition and minutes;
    (i) directory of officers and employees with monthly remuneration;
    (j) budget allocated and expenditures;
    (k) manner of execution of subsidy programmes including beneficiaries;
    (l) recipients of concessions, permits or authorisations;
    (m) details of information available in electronic form;
    (n) particulars of facilities for obtaining information (libraries, reading rooms);
    (o) PIOs names, designations, and contact details;
    (p) other prescribed information.
    UPDATE FREQUENCY: Section 4(1)(b) information must be updated every year.`,
  },
  'Section 5': {
    title: 'Designation of Public Information Officers',
    text: `Every public authority must designate one or more officers as CPIO/SPIO
    at each administrative unit or office. An ACPIO (Assistant CPIO) may also be
    designated to receive applications. Failure to designate a PIO is an offence.`,
  },
  'Section 6': {
    title: 'Request for Obtaining Information',
    text: `Section 6(1): A person seeking information shall make a request in writing
    or through electronic means in English or Hindi or in the official language of the
    area, to the PIO, specifying the particulars of the information sought.

    Section 6(2): An applicant NEED NOT give reasons for the information requested or
    any other personal details except those necessary to contact him.

    Section 6(3): If a request is received by a public authority which does not hold
    the information, it SHALL transfer the request to the appropriate public authority
    within 5 days and inform the applicant of the transfer.`,
  },
  'Section 7': {
    title: 'Disposal of Request',
    text: `Section 7(1): The PIO MUST provide information or reject it within 30 days
    of receiving the application.

    Section 7(1) Proviso: If the information sought concerns the life or liberty of a
    person, it MUST be provided within 48 HOURS of receipt.

    Section 7(2): If a request is transferred under Section 6(3), the period of 30 days
    shall be counted from the date of receipt by the transferee authority.

    Section 7(5): Information shall be provided FREE OF CHARGE to BPL applicants.

    Section 7(6): If the PIO fails to give a decision within the 30-day period, the PIO
    is deemed to have REFUSED the request (deemed refusal — a ground for appeal).

    Section 7(8): Where a request is rejected, the PIO MUST—
    (i)  communicate the reasons for rejection;
    (ii) specify the period within which an appeal may be preferred;
    (iii) name the appellate authority.`,
  },
  'Section 8': {
    title: 'Exemptions from Disclosure',
    text: `The following categories of information are EXEMPT from disclosure:
    (a) National security, sovereignty, strategic, scientific or economic interests;
    (b) Information expressly forbidden by court or disclosure contempt of court;
    (c) Cabinet papers including records of deliberations of CoM, Secretaries & others;
    (d) Information the disclosure of which would endanger the life / physical safety
        of any person or identify the source of information in confidence;
    (e) Fiduciary relationships — unless the competent authority is satisfied that
        larger public interest warrants disclosure;
    (f) Information received in confidence from a foreign government;
    (g) Prejudicial to prevention or detection of crime, or apprehension or prosecution
        of offenders;
    (h) Cabinet papers (deliberations of Council of Ministers);
    (i) Personal information with no relationship to any public activity or interest,
        or which would cause unwarranted invasion of privacy.

    IMPORTANT PROVISO to Section 8(1): Even exempt information MUST be disclosed if
    PUBLIC INTEREST in disclosure outweighs the harm to protected interests.

    Section 8(3): Subject to clause (a), all information that cannot be denied to
    Parliament or a State Legislature shall not be denied to any person.`,
  },
  'Section 9': {
    title: 'Grounds for Rejection',
    text: `A request may be rejected if it involves an infringement of copyright
    subsisting in a person other than the State.`,
  },
  'Section 11': {
    title: 'Third Party Information',
    text: `If information relates to or supplied by a third party and is treated as
    confidential, the PIO must give the third party a written notice and 10 days to
    make a representation before deciding whether to disclose.`,
  },
  'Section 19': {
    title: 'Appeal',
    text: `Section 19(1) — FIRST APPEAL:
    Any person aggrieved by a decision of the PIO may, within 30 days from the
    expiry of the 30-day period or from receipt of the PIO's decision (whichever
    is earlier), appeal to the FIRST APPELLATE AUTHORITY (an officer senior in
    rank to the PIO) of the same public authority.

    Section 19(3) — SECOND APPEAL:
    A second appeal against the decision of the First Appellate Authority lies to
    the Central Information Commission (CIC) or State Information Commission (SIC)
    within 90 days of the date on which the decision was given or ought to have
    been given.

    Section 19(8): The CIC/SIC may—
    (a) require the public authority to take steps to secure compliance;
    (b) require the public authority to compensate the complainant for any loss;
    (c) impose penalty under Section 20;
    (d) reject the application.`,
  },
  'Section 20': {
    title: 'Penalties',
    text: `Section 20(1): If the CIC/SIC is of opinion that the PIO has, without
    reasonable cause, refused to receive an application, or not furnished information
    within the specified period, or malafidely denied the request, or knowingly given
    incorrect/incomplete/misleading information, or destroyed information, or obstructed
    furnishing of information — it SHALL impose a PENALTY of Rs. 250/- per day, subject
    to a MAXIMUM of Rs. 25,000/-.

    Section 20(2): The CIC/SIC shall recommend disciplinary action against the PIO
    where they have, without reasonable cause, repeatedly failed to comply with the
    provisions of this Act.`,
  },
  'Section 18': {
    title: 'Powers and Functions of the Information Commissions',
    text: `The CIC/SIC may receive and inquire into complaints from any person who:
    (a) has been unable to submit an RTI request because no PIO was appointed;
    (b) has been refused access to information requested;
    (c) has not received a response within the time specified;
    (d) has been required to pay an unreasonable fee;
    (e) has been given incomplete, misleading or false information;
    (f) has met with any other problem relating to accessing information.`,
  },
};

// ─── PART 5: Fee Structure ───────────────────────────────────────────────────

const FEE_STRUCTURE = `
RTI FEE STRUCTURE (Central Government — RTI Fee Rules, 2005)
=============================================================

APPLICATION FEE:
  • Rs. 10/- per application
  • Mode: Cash / IPO / DD / Banker's Cheque payable to Accounts Officer of PA
  • BPL applicants: EXEMPT (must attach BPL card copy)

ADDITIONAL FEES (for providing information):
  • Rs. 2/- per page (A4 / A3) for copies
  • Rs. 50/- per diskette or floppy
  • Actual cost for samples / models
  • Inspection of records: FIRST HOUR FREE, then Rs. 5/- per 15 minutes
  • Photocopies in A3/A4: Rs. 2 per page
  • Maps & plans: at actual cost

TIME LIMIT FOR FEE PAYMENT: The period between the date of request for additional
fee and payment by the applicant is EXCLUDED from the 30-day calculation.

STATE GOVERNMENT FEES: Each state may have different fee rules. Common variations:
  • Maharashtra: Rs. 10 (application) + Rs. 2/page
  • Karnataka: Rs. 10 (application) + Rs. 2/page
  • Delhi: Rs. 10 (application) + Rs. 2/page
  • UP: Rs. 10 (application) + Rs. 2/page
`;

// ─── PART 6: Timelines Summary ───────────────────────────────────────────────

const TIMELINES = {
  'Application to PIO response': '30 days from receipt of application',
  'Life or liberty matters': '48 hours from receipt (Section 7(1) proviso)',
  'Transfer to another authority': '5 days (Section 6(3)) — total still 30 days',
  'Third party notice': '10 days to respond before PIO decides (Section 11)',
  'First Appeal filing deadline': '30 days from PIO refusal/deemed refusal',
  'First Appeal decision': '30 days from receipt (extendable to 45 days)',
  'Second Appeal filing deadline': '90 days from First Appellate Authority decision',
  'CIC/SIC decision': 'No statutory limit, typically 3–12 months in practice',
  'Penalty accrual': 'Rs. 250/day from day of default, max Rs. 25,000 (Section 20)',
};

// ─── PART 7: Common Grounds for First / Second Appeal ───────────────────────

const APPEAL_GROUNDS = [
  'PIO failed to respond within 30 days (deemed refusal under Section 7(6))',
  'Information provided was incomplete, incorrect, or misleading',
  'Request was wrongly rejected citing Section 8 exemptions',
  'Unreasonable fee demanded beyond the prescribed schedule',
  'Information relating to life/liberty not provided within 48 hours',
  'Request was not transferred to the correct authority within 5 days',
  'PIO refused to accept the application',
  'Third party procedure under Section 11 was not followed',
  'Disclosure was refused without specifying the reason and appeal period (Section 7(8))',
];

// ─── PART 8: Important CIC Decisions & Principles ───────────────────────────

const IMPORTANT_PRINCIPLES = [
  {
    principle: 'No reasons required',
    detail: 'A citizen is NOT required to give reasons for seeking information. Asking for reasons is a violation of Section 6(2). (CIC/SS/A/2007/00457)',
  },
  {
    principle: 'File notings are disclosable',
    detail: 'File notings are "information" and must be disclosed unless specifically exempt. (Union of India v. Namit Sharma, 2013)',
  },
  {
    principle: 'Larger public interest override',
    detail: 'Even exempt information under Section 8(1) must be disclosed if public interest in disclosure outweighs harm (Section 8(2) proviso).',
  },
  {
    principle: 'Suo motu disclosure',
    detail: 'If information is proactively disclosed under Section 4, no RTI fee can be charged for accessing it.',
  },
  {
    principle: 'Cabinet papers',
    detail: 'Cabinet papers are exempt, but facts and decisions (not deliberations) should be disclosed once a decision is taken.',
  },
  {
    principle: 'Third party commercial confidence',
    detail: 'Information supplied by a third party in commercial confidence is exempt, but this does NOT cover information from government-funded bodies.',
  },
  {
    principle: 'Personal information privacy',
    detail: 'Section 8(1)(j) exempts personal information only where it has no relation to public activity. Salary, assets of public servants are disclosable.',
  },
  {
    principle: 'Right to life includes RTI',
    detail: 'Information concerning life or liberty must be disclosed within 48 hours — failure is a serious default (CIC/SA/C/2015/000161).',
  },
];

// ─── PART 9: RTI Application Checklist ──────────────────────────────────────

const APPLICATION_CHECKLIST = [
  'Application addressed to the correct PIO of the relevant public authority',
  'Written in English, Hindi, or official local language',
  'Specific and precise information requested (avoid vague/broad requests)',
  'No need to state reasons (Section 6(2))',
  'Application fee of Rs. 10/- enclosed (or BPL card copy for exemption)',
  'Applicant name and postal address / e-mail clearly stated',
  'Date and place of filing mentioned',
  'Copies of relevant documents attached if they support the request (optional)',
  'Proof of submission obtained (acknowledgement receipt / registered post slip)',
  'Copy of application retained for records',
];

// ─── PART 10: Compact Legal Reference (for AI prompt injection) ─────────────

/**
 * Returns a concise legal reference string suitable for injection
 * into an AI prompt to guide RTI application drafting.
 *
 * @param {Object} opts
 * @param {boolean} opts.includeFees      - Include fee structure (default true)
 * @param {boolean} opts.includeTimelines - Include timelines (default true)
 * @param {boolean} opts.includeAppeals   - Include appeal sections (default true)
 * @param {string[]} opts.sections        - Specific section keys to include
 *                                          (default: all key sections)
 * @returns {string}
 */
function getLegalContextForPrompt(opts = {}) {
  const {
    includeFees      = true,
    includeTimelines = true,
    includeAppeals   = true,
    sections         = Object.keys(KEY_SECTIONS),
  } = opts;

  const lines = [];

  lines.push('=== RTI ACT 2005 — LEGAL REFERENCE FOR DRAFTING ===\n');
  lines.push(ACT_OVERVIEW);

  lines.push('\n--- KEY SECTIONS ---');
  for (const key of sections) {
    const s = KEY_SECTIONS[key];
    if (s) {
      lines.push(`\n${key}: ${s.title}\n${s.text.trim()}`);
    }
  }

  if (includeFees) {
    lines.push('\n--- FEE STRUCTURE ---');
    lines.push(FEE_STRUCTURE.trim());
  }

  if (includeTimelines) {
    lines.push('\n--- STATUTORY TIMELINES ---');
    for (const [k, v] of Object.entries(TIMELINES)) {
      lines.push(`  • ${k}: ${v}`);
    }
  }

  if (includeAppeals) {
    lines.push('\n--- APPEAL RIGHTS ---');
    lines.push(KEY_SECTIONS['Section 19'].text.trim());
    lines.push('\nCommon grounds for appeal:');
    APPEAL_GROUNDS.forEach((g, i) => lines.push(`  ${i + 1}. ${g}`));
  }

  lines.push('\n=== END OF LEGAL REFERENCE ===');
  return lines.join('\n');
}

/**
 * Returns only the essential sections most relevant to a single RTI application draft.
 * Lightweight version — good for token-efficient prompts.
 *
 * @returns {string}
 */
function getEssentialLegalContext() {
  return getLegalContextForPrompt({
    includeFees: true,
    includeTimelines: true,
    includeAppeals: false,
    sections: ['Section 3', 'Section 6', 'Section 7', 'Section 8', 'Section 19', 'Section 20'],
  });
}

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  // Data objects — use for programmatic logic
  ACT_OVERVIEW,
  DEFINITIONS,
  FILING_PROCEDURE,
  KEY_SECTIONS,
  FEE_STRUCTURE,
  TIMELINES,
  APPEAL_GROUNDS,
  IMPORTANT_PRINCIPLES,
  APPLICATION_CHECKLIST,

  // Helper functions — use for AI prompt construction
  getLegalContextForPrompt,
  getEssentialLegalContext,
};
