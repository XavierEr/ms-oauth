import 'dotenv/config';

import axios from 'axios';

export const authHttpClient = axios.create({
  baseURL: `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID ?? 'common'}/oauth2/v2.0`,
});