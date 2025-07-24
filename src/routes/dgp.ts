import express from 'express';
import { randomUUID } from 'node:crypto';
import * as jose from 'jose';

import { getSystemsByAgency } from '../apis/apexDgp.js';

import {
  privateJwk,
  sha256,
} from '../utils/apex.js';

const router = express.Router();

router.get('/systems', async (_req, res, _next) => {
  const privateJwkJson = await privateJwk();

  const body = { payload: 'data' };

  const alg = 'ES256';
  const kid = privateJwkJson.kid!;
  const typ = 'JWT';

  const stagingInternetApiKey = 'd3ec475e-4c80-411c-a2eb-4861f7f86b9d';
  const stagingIntranetApiKey = '12b7507c-0d49-418a-96b4-6a0b94bdef19';
  const aud = `${process.env.APEX_URL}/api/DGPAPI/V2/ExecuteSearch/SystemsByAgency`;
  const exp = '180s';
  const iss = [stagingInternetApiKey, stagingIntranetApiKey].join(',');
  const jti = randomUUID();
  const sub = 'POST';
  const data = sha256(JSON.stringify(body));

  const jwtPayload = {
    aud,
    iss,
    jti,
    sub,
    data,
  };

  const privateKey = await jose.importJWK(privateJwkJson, alg);

  const jwt = await new jose.SignJWT(jwtPayload)
    .setProtectedHeader({ alg, kid, typ, })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(privateKey);

  try {
    const consumerName = 'IM8SSP';
    const agencyName = 'GOVTECH';

    const response = await getSystemsByAgency(jwt, consumerName, agencyName);
    
    res.json(response);
  } catch (error: any) {
    console.log(error.message)
  }
});

export default router;