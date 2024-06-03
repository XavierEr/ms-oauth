import express from 'express';

const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.json({ 'I am': 'ok lah' });
});

export default router;