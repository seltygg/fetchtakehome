import fetchClient from './fetchClient';
import type { Location, Coordinates } from '../types';

export async function getLocationsByZipCodes(zipCodes: string[]): Promise<Location[]> {
  const res = await fetchClient.post<Location[]>('/locations', zipCodes);
  return res.data;
}

interface SearchLocationsParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
    bottom_right?: Coordinates;
    top_right?: Coordinates;
  };
  size?: number;
  from?: number;
}

interface SearchLocationsResponse {
  results: Location[];
  total: number;
}

export async function searchLocations(params: SearchLocationsParams): Promise<SearchLocationsResponse> {
  const res = await fetchClient.post<SearchLocationsResponse>('/locations/search', params);
  return res.data;
} 