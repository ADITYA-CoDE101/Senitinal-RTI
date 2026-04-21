/**
 * ministryMapper.js
 * Maps Sentinel complaint categories → RTI portal Ministry/Department names.
 * Used to auto-suggest the correct ministry when submitting to rtionline.gov.in.
 *
 * Ministry names must match EXACTLY what appears in the RTI portal dropdown.
 * Reference: https://rtionline.gov.in/request/allpa.php
 */

const CATEGORY_TO_MINISTRY = {
  'Road & Infrastructure':  'Ministry of Road Transport and Highways',
  'Water & Sanitation':     'Ministry of Jal Shakti',
  'Electricity & Power':    'Ministry of Power',
  'Healthcare':             'Ministry of Health and Family Welfare',
  'Education':              'Ministry of Education',
  'Municipal Services':     'Ministry of Housing and Urban Affairs',
  'Land & Property':        'Ministry of Rural Development',
  'Public Transport':       'Ministry of Railways',
  'Environment':            'Ministry of Environment, Forest and Climate Change',
  'Other':                  'Department of Personnel and Training',
};

/**
 * Returns the suggested RTI ministry name for a given Sentinel category.
 * @param {string} category  Sentinel complaint category
 * @returns {string}         RTI portal ministry name
 */
function getMinistry(category) {
  return CATEGORY_TO_MINISTRY[category] || CATEGORY_TO_MINISTRY['Other'];
}

/**
 * Returns all available RTI ministry options as an array.
 * @returns {string[]}
 */
function getAllMinistries() {
  return [...new Set(Object.values(CATEGORY_TO_MINISTRY))];
}

module.exports = { getMinistry, getAllMinistries, CATEGORY_TO_MINISTRY };
