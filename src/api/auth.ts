import api from './index';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  return api.post<LoginResponse>('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const logout = () => {
  return api.post('/auth/logout');
};