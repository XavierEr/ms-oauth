import {
  createHash,
  randomBytes,
} from 'node:crypto';

function base64URLEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sha256(str: string): Buffer {
  return createHash('sha256').update(str).digest();
}

export function generateCodeVerifier(): string {
  return base64URLEncode(randomBytes(32));
}

export function generateCodeChallengeFromVerifier(codeVerifier: string): string {
  return base64URLEncode(sha256(codeVerifier))
}

// Dependency: Node.js crypto module
// https://nodejs.org/api/crypto.html#crypto_crypto
// function base64URLEncode(str) {
//   return str.toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=/g, '');
// }
// var verifier = base64URLEncode(crypto.randomBytes(32));

// Dependency: Node.js crypto module
// https://nodejs.org/api/crypto.html#crypto_crypto
// function sha256(buffer) {
//   return crypto.createHash('sha256').update(buffer).digest();
// }
// var challenge = base64URLEncode(sha256(verifier));