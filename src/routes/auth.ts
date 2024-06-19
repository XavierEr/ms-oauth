import 'dotenv/config';

import express from 'express';

import {
  generateCodeChallengeFromVerifier,
  generateCodeVerifier,
} from '../utils/pkce.js';

import { getToken } from '../apis/msAPIs.js';

// const SCOPE = ['openid', 'profile', 'email', 'offline_access'];
const SCOPE = ['openid'];

const router = express.Router();

router.get('/', (req, res, _next) => {
  const baseURL = `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID ?? 'common'}/oauth2/v2.0/authorize`;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallengeFromVerifier(codeVerifier);

  if (!req.session.pkceCodes) {
    req.session.pkceCodes = {
      challengeMethod: 'S256'
    };
  }
  req.session.pkceCodes.verifier = codeVerifier;
  req.session.pkceCodes.challenge = codeChallenge;

  const searchParams = new URLSearchParams();

  searchParams.append('client_id', process.env.CLIENT_ID!); // Mandatory
  searchParams.append('response_type', 'code'); // Mandatory
  searchParams.append('redirect_uri', process.env.REDIRECT_URI!); // Mandatory
  searchParams.append('scope', SCOPE.join(' ')); // Mandatory
  searchParams.append('code_challenge', codeChallenge); // Mandatory
  searchParams.append('code_challenge_method', 'S256'); // Mandatory
  searchParams.append('response_mode', 'query');

  const redirectURL = `${baseURL}?${searchParams.toString()}`;

  res.redirect(redirectURL);
});

router.get('/redirect', async (req, res, _next) => {
  try {
    const response = await getToken(
      process.env.CLIENT_ID!,
      SCOPE,
      req.query.code,
      process.env.REDIRECT_URI!,
      'authorization_code',
      req.session.pkceCodes ? req.session.pkceCodes.verifier : undefined,
      process.env.CLIENT_SECRET!
    );

    console.log('test', response);
    res.json({ 'I am': 'ok lah' });
  } catch (error) {
    console.log('error', error);
    res.status(500).send(error);
  }
});

export default router;