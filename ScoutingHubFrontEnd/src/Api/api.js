// src/api/api.js
import axios from 'axios';
import { SERVER_URL } from '../utils/constants.js';

// Create an Axios instance
const api = axios.create({
  baseURL: SERVER_URL, 
});

// You can add request interceptors to handle common tasks like adding tokens to headers
api.interceptors.request.use((config) => {
  // Example: Add authorization token if available
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (userInfo && userInfo.token) {
    const token = userInfo.token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    console.error("Interceptor request error:", error);
    return Promise.reject(error);
  }
);

export default api;