import fetchClient from './fetchClient';
import type { Dog } from '../types';

export interface SearchDogsParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

export interface SearchDogsResponse {
  resultIds: string[];
  total: number;
  next?: unknown;
  prev?: unknown;
}

export async function getBreeds(): Promise<string[]> {
  const res = await fetchClient.get<string[]>('/dogs/breeds');
  return res.data;
}

export async function searchDogs(params: SearchDogsParams): Promise<SearchDogsResponse> {
  const res = await fetchClient.get<SearchDogsResponse>('/dogs/search', { params });
  return res.data;
}

export async function getDogsByIds(ids: string[]): Promise<Dog[]> {
  const res = await fetchClient.post<Dog[]>('/dogs', ids);
  return res.data;
}

export async function matchDog(ids: string[]): Promise<string> {
  const res = await fetchClient.post<{ match: string }>('/dogs/match', ids);
  return res.data.match;
} 