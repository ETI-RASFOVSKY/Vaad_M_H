import axios from 'axios'

// Get API URL - try multiple sources for flexibility
const getApiUrl = () => {
  // 1. Try Vite env var (available at build time)
  const viteApiUrl = import.meta.env.VITE_API_URL
  if (viteApiUrl && viteApiUrl.trim() !== '') {
    return viteApiUrl.trim()
  }
  
  // 2. Runtime fallback for production - if on Render, use backend URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // If on render.com domain (production), use backend URL
    if (hostname.includes('render.com')) {
      // Always use the backend URL for Render deployments
      return 'https://vaad-backend-i96q.onrender.com'
    }
    
    // If localhost, use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000'
    }
  }
  
  // 3. Default fallback
  return 'https://vaad-backend-i96q.onrender.com'
}

let API_URL = getApiUrl()

// Ensure API_URL is never empty
if (!API_URL || API_URL.trim() === '') {
  console.warn('⚠️ API_URL was empty, using fallback')
  API_URL = 'https://vaad-backend-i96q.onrender.com'
}

// Remove trailing slash if present
API_URL = API_URL.replace(/\/$/, '')

// Debug: log the API URL (will be removed in production)
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', API_URL || '(EMPTY - THIS IS A PROBLEM!)')
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - Window hostname:', window.location.hostname)
  if (!API_URL || API_URL.trim() === '') {
    console.error('❌ ERROR: API_URL is empty! Requests will fail!')
  } else {
    console.log('✅ API_URL is set correctly:', API_URL)
  }
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Ensure baseURL is set
  if (!config.baseURL || config.baseURL.trim() === '') {
    console.error('❌ baseURL is empty in request! Using fallback.')
    config.baseURL = 'https://vaad-backend-i96q.onrender.com'
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
