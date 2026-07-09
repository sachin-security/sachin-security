// app/lib/idcrypto.ts
// Lightweight, reversible obfuscation of the employee ID used in QR links.
// Goal: stop enumeration of employees by guessing sequential IDs (ss-1, ss-2...).
// The token is only reversible with the server-side secret.
const SECRET = process.env.ID_ENCRYPTION_KEY || 'sachin-security-default-key-sss';

function xor(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(input.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
  }
  return out;
}

// Employee ID -> URL/QR-safe token.
export function encryptId(id: string): string {
  return Buffer.from(xor(id), 'binary').toString('base64url');
}

// Token -> employee ID (null if malformed).
export function decryptId(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('binary');
    return xor(decoded) || null;
  } catch {
    return null;
  }
}
