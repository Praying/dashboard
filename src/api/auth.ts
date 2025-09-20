import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1', // The proxy in vite.config.ts will handle this
});

export const login = (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  return apiClient.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};