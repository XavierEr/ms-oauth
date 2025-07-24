import {
  createPrivateKey,
  createPublicKey,
  createHash,
} from 'node:crypto';
import * as jose from 'jose';

import redisClient from './redisClient.js';

import { generateKeyPair } from './ellipticCurve.js';

const PRIVATE_JWK_STRING_REDIS_KEY = 'privateJwk';
const PUBLIC_JWK_STRING_REDIS_KEY = 'publicJwk';

async function generatePrivateJwkJson(privateKey: string): Promise<jose.JWK> {
  const privateJwk = await jose.exportJWK(createPrivateKey(privateKey));
  const kid = await jose.calculateJwkThumbprint(privateJwk, 'sha256');

  const privateJwkJson = { ...privateJwk, kid };

  return privateJwkJson;
}

async function generatePublicJwkJson(publicKey: string): Promise<jose.JWK> {
  const publicJwk = await jose.exportJWK(createPublicKey(publicKey));
  const publicJwkkid = await jose.calculateJwkThumbprint(publicJwk, 'sha256');

  const publicJwkJson = {
    ...publicJwk,
    kid: publicJwkkid,
    use: 'sig',
    alg: 'ES256'
  };

  return publicJwkJson;
}

export async function publicJwks(): Promise<jose.JWK> {
  const privateStringJwk = await redisClient.GET(PRIVATE_JWK_STRING_REDIS_KEY);
  const publicStringJwk = await redisClient.GET(PUBLIC_JWK_STRING_REDIS_KEY);

  if (privateStringJwk !== null && publicStringJwk !== null) {
    const publicJwkJson = JSON.parse(publicStringJwk);

    return {
      keys: [publicJwkJson]
    };
  } else {
    const { privateKey, publicKey } = generateKeyPair('prime256v1');

    const privateJwkJson = await generatePrivateJwkJson(privateKey);
    await redisClient.SET(PRIVATE_JWK_STRING_REDIS_KEY, JSON.stringify(privateJwkJson));

    const publicJwkJson = await generatePublicJwkJson(publicKey);
    await redisClient.SET(PUBLIC_JWK_STRING_REDIS_KEY, JSON.stringify(publicJwkJson));

    return {
      keys: [publicJwkJson]
    };
  }
}

export async function privateJwk(): Promise<jose.JWK> {
  const privateStringJwk = await redisClient.GET(PRIVATE_JWK_STRING_REDIS_KEY);
  const publicStringJwk = await redisClient.GET(PUBLIC_JWK_STRING_REDIS_KEY);

  if (privateStringJwk !== null && publicStringJwk !== null) {
    const privateJwkJson = JSON.parse(privateStringJwk);

    return privateJwkJson;
  } else {
    const { privateKey, publicKey } = generateKeyPair('prime256v1');

    const privateJwkJson = await generatePrivateJwkJson(privateKey);
    await redisClient.SET(PRIVATE_JWK_STRING_REDIS_KEY, JSON.stringify(privateJwkJson));

    const publicJwkJson = await generatePublicJwkJson(publicKey);
    await redisClient.SET(PUBLIC_JWK_STRING_REDIS_KEY, JSON.stringify(publicJwkJson));

    return privateJwkJson;
  }
}

export function sha256(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}