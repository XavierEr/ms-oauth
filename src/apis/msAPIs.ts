import { authHttpClient } from '../utils/msHttpClient.js';

import type { AxiosRequestConfig } from 'axios';

export async function getToken(
  clientId: string,
  scope: Array<string>,
  code: string,
  redirectUrl: string,
  grantType: 'authorization_code',
  codeVerifier: string | undefined,
  clientSecret: string | undefined
): Promise<any> {

  const url = '/token';

  const body = {
    client_id: clientId, // Mandatory
    code: code, // Mandatory
    redirect_uri: redirectUrl, // Mandatory
    grant_type: grantType, // Mandatory
    ...(!!codeVerifier && { code_verifier: codeVerifier }), // Mandatory
    ...(!!clientSecret && { client_secret: encodeURIComponent(clientSecret) }), // Mandatory
    ...(scope.length > 0 && { scope: scope.join(' ') }) // Optional
  };

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const response = await authHttpClient.post(url, body, config);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.data);
}