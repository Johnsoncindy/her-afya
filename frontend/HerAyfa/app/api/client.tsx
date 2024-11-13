import axios from 'axios';

const API_BASE_URL = 'https://api-yaks55f2ta-uc.a.run.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;