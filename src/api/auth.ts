import fetchClient from './fetchClient';

export async function login(name: string, email: string) {
  return fetchClient.post('/auth/login', { name, email });
}

export async function logout() {
  return fetchClient.post('/auth/logout');
} 