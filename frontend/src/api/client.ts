import axios from 'axios'

// 1. הגדרה ישירה וקשיחה - לא משתמשים ב-import.meta.env בכלל!
const API_URL = 'https://vaad-m-h.onrender.com';

console.log('✅ FORCED API URL:', API_URL);

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Interceptor להוספת טוקן ולוגים
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // כאן נראה בבירור אם הכתובת תקינה
  console.log(`🚀 AXIOS CALLING: ${config.baseURL}${config.url || ''}`);
  
  return config;
}, (error) => {
  return Promise.reject(error);
})

export default client;