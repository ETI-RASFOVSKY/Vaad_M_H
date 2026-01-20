import axios from 'axios'

/**
 * שימוש במשתנה סביבה חדש כדי לעקוף בעיות Cache ב-Vercel
 * חשוב: המשתנה ב-Vercel חייב להתחיל ב-VITE_
 */
const ENV_URL = import.meta.env.VITE_VERCEL_API_URL;
const FALLBACK_URL = 'https://vaad-m-h.onrender.com';

// ניקוי רווחים ובדיקת תקינות
const getBaseUrl = () => {
  if (ENV_URL && typeof ENV_URL === 'string') {
    const cleaned = ENV_URL.trim().replace(/[\s\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, '');
    if (cleaned.length > 10 && cleaned.startsWith('http')) {
      return cleaned;
    }
  }
  return FALLBACK_URL;
};

const API_URL = getBaseUrl();

console.log('🛡️ API URL IN USE:', API_URL);
if (import.meta.env.VITE_VERCEL_API_URL) {
    console.log('🔗 Source: Vercel Environment Variable');
} else {
    console.log('🏠 Source: Hardcoded Fallback');
}

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// הוספת Token לכל בקשה ולוג מעקב ב-Console
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // לוג זה יוכיח לך ב-Console שהבקשה אכן יוצאת לכתובת הנכונה
  console.log(`📡 SENDING REQUEST TO: ${config.baseURL}${config.url || ''}`)
  
  return config
}, (error) => {
  return Promise.reject(error)
})

export default client