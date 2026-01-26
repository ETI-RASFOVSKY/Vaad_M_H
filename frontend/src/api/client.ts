import axios from 'axios'

// Get API URL from environment
// In production (Vercel), this MUST be set in Environment Variables
const API_URL = import.meta.env.VITE_API_URL || 'https://vaad-m-h.onrender.com'

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('⚠️ VITE_API_URL not set! Using fallback. Please configure it in Vercel Environment Variables.')
}

console.log('🌐 API URL:', API_URL)

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client;