import crypto from 'node:crypto';

export type Curve =
  'prime256v1' | // P-256 (secp256r1)
  'secp384r1';   // P-384 (secp384r1)

export function generateKeyPair(curve: Curve): crypto.KeyPairSyncResult<string, string> {
  return crypto.generateKeyPairSync('ec', {
    namedCurve: curve,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}