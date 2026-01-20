import axios from 'axios'

/**
 * פעולה קיצונית: עקיפת משתני הסביבה (Environment Variables)
 * הגדרת כתובת ה-API באופן קשיח כדי למנוע בעיות של רווחים או Cache ב-Vercel.
 */
const API_URL = 'https://vaad-m-h.onrender.com'

console.log('🛡️ HARDCODED API URL IN USE:', API_URL)

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