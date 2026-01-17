import axios from 'axios'

// Backend URL configuration
// Note: baseURL should NOT include /api - it's added in the request paths
const getApiUrl = () => {
  // 1. Explicit env (Vercel / local) - should be full URL without /api
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL
    // Remove trailing /api if present
    return url.replace(/\/api\/?$/, '')
  }

  // 2. Production fallback - Render backend
  if (import.meta.env.PROD) {
    return 'https://vaad-m-h.onrender.com'
  }

  // 3. Local development
  return 'http://localhost:5000'
}

const API_URL = getApiUrl()

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', API_URL)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - PROD mode:', import.meta.env.PROD)
  console.log('  - Window hostname:', window.location.hostname)
  console.log('✅ Using API URL:', API_URL)
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
  // Ensure baseURL is always set
  if (!config.baseURL || config.baseURL.trim() === '') {
    config.baseURL = API_URL
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
