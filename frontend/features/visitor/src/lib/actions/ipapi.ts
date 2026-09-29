'use server';

import { withApi } from '@next-feature/client/server';
import { z } from 'zod';
import { ApiClient } from '@next-feature/client';

/**
 * [get-ip-details]
 * next-feature@0.1.4-2
 * September 13th 2026, 9:57:13 pm
 */
const api = new ApiClient({
  baseURL: 'http://ip-api.com',
  enableRefreshToken: false,
});

export type GetIpDetailsRequest = {
  ip: string;
};
export type GetIpDetailsResponse = IpDetails & {
};

export const getIpDetails = withApi(
  async (options: GetIpDetailsRequest) => {
    const params = new URLSearchParams({
      fields:
        'country,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query',
    });
    const endpoint = `/json/${options.ip}?` + params.toString();
    return await api.get<GetIpDetailsResponse>(endpoint);
  },
  {
    fallbackData: {
      query: '',
      status: '',
      country: '',
      countryCode: '',
      region: '',
      regionName: '',
      city: '',
      zip: '',
      lat: 0,
      lon: 0,
      timezone: '',
      isp: '',
      org: '',
      as: '',
      reverse: '',
      mobile: false,
      proxy: false,
      hosting: false,
    },
  },
);

export interface IpDetails {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  reverse: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}
