import api from './api';

export interface User {
  user_id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export const login = async (username: string, password: string) => {
  const res = await api.post<LoginResponse>('/api/login', {
    username,
    password,
  });
  return res.data;
};

export const signup = async (
  username: string,
  email: string,
  password: string,
  gender?: string
) => {
  const res = await api.post('/api/signup', {
    username,
    email,
    password,
    gender,
  });
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/api/logout');
  return res.data;
};