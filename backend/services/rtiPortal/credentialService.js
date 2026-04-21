/**
 * credentialService.js
 * Encrypts and decrypts RTI portal credentials using AES-256 (via crypto-js).
 * The encryption key is derived from RTI_CRED_SECRET in the environment.
 */

const CryptoJS = require('crypto-js');

const SECRET = process.env.RTI_CRED_SECRET || 'sentinel_rti_default_secret_change_me';

/**
 * Encrypts a plaintext string (username or password).
 * @param {string} plaintext
 * @returns {string} AES-encrypted ciphertext
 */
function encrypt(plaintext) {
  if (!plaintext) return '';
  return CryptoJS.AES.encrypt(plaintext, SECRET).toString();
}

/**
 * Decrypts an AES-encrypted ciphertext back to plaintext.
 * @param {string} ciphertext
 * @returns {string} decrypted plaintext
 */
function decrypt(ciphertext) {
  if (!ciphertext) return '';
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
