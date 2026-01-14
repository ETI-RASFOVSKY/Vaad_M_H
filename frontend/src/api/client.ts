import axios from 'axios'

// Backend URL configuration
// Priority: 1. VITE_API_URL env variable, 2. Render production URL, 3. Localhost for development
const getApiUrl = () => {
  // If VITE_API_URL is set, use it (for local development or custom backend)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // For production on Render (when deployed)
  if (import.meta.env.PROD) {
    return 'https://vaad-backend-i96q.onrender.com'
  }
  
  // Default to localhost for development
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
