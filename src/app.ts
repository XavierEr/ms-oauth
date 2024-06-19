import 'dotenv/config';

import { URL } from 'node:url';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import express from 'express';
// import cookieParser from 'cookie-parser';
import session,
{ type SessionOptions } from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import authRouter from './routes/auth.js';
import heartbeatRouter from './routes/heartbeat.js';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express();

const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on('error', (error: Error) => console.error(error));
redisClient.on('end', () => console.log('Redis disconnected.'));
redisClient.connect();

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'ms-oauth:'
});

const sessionConfig: SessionOptions = {
  secret: 'ms-oauth',
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 3600000
  }
};

app.set('port', (process.env.PORT) || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/heartbeat', heartbeatRouter);

const options = {
  key: fs.readFileSync(path.resolve(__dirname, process.env.PRIVATE_KEY_PATH!)),
  cert: fs.readFileSync(path.resolve(__dirname, process.env.CERTIFICATE_PATH!)),
};

const server = https.createServer(options, app).listen(app.get('port'), () => {
  console.log(`Node app listening on port`, app.get('port'));
  console.log(`Node environment`, process.env.NODE_ENV || 'development');
});

function shutdownServer() {
  try {
    server.close(async () => {
      console.log('HTTPS server closed.');

      await redisClient.quit();

      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  shutdownServer();
});

process.on('SIGTERM', () => {
  shutdownServer();
});

export default app;