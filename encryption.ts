import CryptoJS from "crypto-js";

// In a real application, this would be stored securely and rotated regularly
const SECRET_KEY = "your-secret-key-here";

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function getEncryptionSteps(text: string) {
  const steps = [];

  // Step 1: Convert to UTF-8
  const utf8 = CryptoJS.enc.Utf8.parse(text);
  steps.push({
    step: "Convert to UTF-8",
    result: utf8.toString()
  });

  // Step 2: Generate IV
  const iv = CryptoJS.lib.WordArray.random(16);
  steps.push({
    step: "Generate Initialization Vector (IV)",
    result: iv.toString()
  });

  // Step 3: Encrypt with AES
  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY, {
    iv: iv
  });
  steps.push({
    step: "AES Encryption",
    result: encrypted.toString()
  });

  return steps;
}
