import axios from 'axios'

// Backend URL configuration
const getApiUrl = () => {
  // 1. Explicit env (Vercel / local)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // 2. Production fallback
  if (import.meta.env.PROD) {
    return 'https://vaad-m-h.onrender.com'
  }

  // 3. Local development
  return 'http://localhost:5000/api'
}

const API_URL = getApiUrl()

// Debug logging (אפשר להשאיר זמנית)
if (typeof window !== 'undefined') {
  console.log('🔗 API_URL:', API_URL)
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
