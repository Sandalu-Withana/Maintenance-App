import axios from 'axios';

const BASE_URL = 'https://ac-shift-poc-963364815043.us-central1.run.app';
// const BASE_URL = 'http://localhost:5173/api';
const TOKEN = localStorage.getItem('site') || '';
const TOKEN_TYPE = localStorage.getItem('tokenType') || '';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `${TOKEN_TYPE} ${TOKEN}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Token expired, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
