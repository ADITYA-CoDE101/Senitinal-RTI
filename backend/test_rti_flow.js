/**
 * test_rti_flow.js  —  Standalone RTI portal automation test
 *
 * Run: node test_rti_flow.js
 *
 * Steps:
 *  1. Browser opens → navigates to RTI portal, accepts guidelines (auto)
 *  2. Email + phone filled (auto) → YOU solve CAPTCHA → click Submit
 *  3. OTP page → YOU enter OTP → click Submit
 *  4. RTI form → ALL FIELDS filled (auto) + sanitized
 *  5. YOU solve the form CAPTCHA → click "Make Payment"
 *  6. Payment URL captured ✅
 */

require('dotenv').config();
const adapter = require('./services/rtiPortal/rtionlineAdapter');

const TEST_EMAIL = process.env.TEST_RTI_EMAIL || 'zombie7933@gmail.com';
const TEST_PHONE = process.env.TEST_RTI_PHONE || '8708470492';

// Matches Aditya's registered profile exactly
const FORM_DATA = {
  ministry:      'Ministry of Road Transport and Highways',
  applicantName: 'Aditya',
  gender:        'M',
  address:       'Ring Road colony Delhi Cant',
  pincode:       '110010',
  state:         'Delhi',
  phone:         TEST_PHONE,
  email:         TEST_EMAIL,
  isBPL:         false,
  rtiText:       'Under the Right to Information Act 2005 I hereby request the following information. Please provide details of the road condition maintenance status and pending complaints in the area of Ring Road colony Delhi Cantonment. Please provide records of maintenance work done in the last 6 months and any pending work orders with expected completion dates.',
};

async function runTest() {
  console.log('\n========================================');
  console.log('  RTI PORTAL AUTOMATION — FULL TEST');
  console.log('========================================');
  console.log(`  Email:   ${TEST_EMAIL}`);
  console.log(`  Phone:   ${TEST_PHONE}`);
  console.log(`  Profile: ${FORM_DATA.applicantName}, ${FORM_DATA.address}`);
  console.log('========================================');
  console.log('\n  WHAT YOU NEED TO DO:');
  console.log('  1. Solve the CAPTCHA on the email/phone page → click Submit');
  console.log('  2. Enter the OTP from your email/SMS → click Submit');
  console.log('  3. Solve the CAPTCHA on the RTI form → click Make Payment');
  console.log('========================================\n');

  let browser;
  try {
    browser = await adapter.launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Step 1+2: Navigate + accept guidelines (fully automatic)
    await adapter.acceptGuidelines(page);

    // Step 3: Fill email + phone → wait for user to solve CAPTCHA
    await adapter.fillEmailAndWaitForCaptcha(page, TEST_EMAIL, TEST_PHONE);

    // Step 4: Wait for user to enter OTP
    await adapter.waitForOTPVerification(page);

    // Step 5: Auto-fill entire RTI form
    await adapter.fillRTIForm(page, FORM_DATA);

    // Step 6: Wait for user to solve form CAPTCHA + click Make Payment
    const { paymentUrl } = await adapter.submitAndCapturePaymentUrl(page);

    console.log('\n🎉 SUCCESS! Payment page reached:');
    console.log('   ', paymentUrl);
    console.log('\n   Complete the ₹10 payment in the browser to finalize the RTI.');
    console.log('   The browser will remain open.');

  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    console.log('   Browser left open for inspection (if it opened).');
  }
}

runTest();
