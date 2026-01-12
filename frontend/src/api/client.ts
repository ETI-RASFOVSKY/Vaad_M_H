import axios from 'axios'

// Get API URL - try multiple sources for flexibility
const getApiUrl = () => {
  // 1. Try Vite env var (available at build time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 2. Try window location for runtime (if deployed on same domain with proxy)
  if (typeof window !== 'undefined') {
    // For production, if backend is on Render but env var wasn't set during build
    // We can try to construct it from current domain or use a fallback
    const hostname = window.location.hostname
    
    // If on render.com domain, try to construct backend URL
    if (hostname.includes('render.com') && hostname.includes('frontend')) {
      // Extract project name from frontend URL and construct backend URL
      // This is a fallback - should use VITE_API_URL in production
      return 'https://vaad-backend-i96q.onrender.com'
    }
  }
  
  // 3. Default fallback
  return 'http://localhost:5000'
}

const API_URL = getApiUrl()

// Debug: log the API URL (will be removed in production)
if (typeof window !== 'undefined') {
  console.log('API_URL:', API_URL)
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL)
  console.log('Window location:', window.location.hostname)
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
client.interceptors.request.use((config) => {
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
