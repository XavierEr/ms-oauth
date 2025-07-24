import got from 'got';

export const apexHttpClient = got.extend({
  prefixUrl: process.env.APEX_URL,
});