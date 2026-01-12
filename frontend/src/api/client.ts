import axios from 'axios'

// Backend URL - default to production backend
const DEFAULT_API_URL = 'https://vaad-backend-i96q.onrender.com'
const LOCAL_API_URL = 'http://localhost:5000'

// Get API URL - simple and direct approach
let API_URL = DEFAULT_API_URL

// 1. Try Vite env var first (available at build time)
const viteApiUrl = import.meta.env.VITE_API_URL
if (viteApiUrl && viteApiUrl.trim() !== '') {
  API_URL = viteApiUrl.trim()
} else if (typeof window !== 'undefined') {
  // 2. Runtime detection for localhost (only if env var not set)
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    API_URL = LOCAL_API_URL
  }
  // For production (render.com), use default (DEFAULT_API_URL)
}

// Remove trailing slash if present
API_URL = API_URL.replace(/\/$/, '')

// Debug: log the API URL
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', API_URL)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - Window hostname:', window.location.hostname)
  console.log('✅ API_URL is set to:', API_URL)
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Ensure baseURL is always set
  if (!config.baseURL || config.baseURL.trim() === '') {
    config.baseURL = DEFAULT_API_URL
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for better error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        data: error.response.data,
      })
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      })
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default client
