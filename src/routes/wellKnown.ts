import express from 'express';

import { publicJwks } from '../utils/apex.js';

const router = express.Router();

router.get('/jwks.json', async (_req, res, _next) => {
  const publicJwksJson = await publicJwks();
  
  return res.json(publicJwksJson);
});

export default router;