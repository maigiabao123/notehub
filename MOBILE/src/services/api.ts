import axios from 'axios';


import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'  // Android emulator gọi về máy thật
    : 'http://localhost:5000'; // Web / iOS dev

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };