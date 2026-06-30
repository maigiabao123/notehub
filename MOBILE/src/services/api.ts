import axios from 'axios';


const BASE_URL = 'http://127.0.0.1:5000';

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