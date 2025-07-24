import { type CancelableRequest } from 'got';

import { apexHttpClient } from '../utils/apexHttpClient.js';

export function getSystemsByAgency(apexJwt: string, consumerName: string, agencyName: string): CancelableRequest<DgpSystemsResponse> {
  const body = { payload: 'data' };

  const url = 'api/DGPAPI/V2/ExecuteSearch/SystemsByAgency';

  return apexHttpClient.post(url, {
    json: body,
    headers: {
      'Accept': 'text/plain, application/json',
      'x-apex-jwt': apexJwt,
      'ConsumerName': consumerName,
      'AgencyName': agencyName,
    },
    https: {
      rejectUnauthorized: false
    }
  }).json<DgpSystemsResponse>();
}