import axios from 'axios'

// Backend URL configuration
// Note: baseURL should NOT include /api - it's added in the request paths
const getApiUrl = () => {
  // 1. Explicit env (Vercel / local) - should be full URL without /api
  const viteApiUrl = import.meta.env.VITE_API_URL
  if (viteApiUrl && typeof viteApiUrl === 'string' && viteApiUrl.trim() !== '') {
    const url = viteApiUrl.trim()
    // Remove trailing /api if present
    const cleanUrl = url.replace(/\/api\/?$/, '')
    if (cleanUrl) {
      return cleanUrl
    }
  }

  // 2. Production fallback - Render backend
  // Check if we're in production by multiple methods
  // In Vercel, PROD might not be set correctly, so check hostname first
  let isProduction = false
  
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname
    // If hostname includes vercel.app, netlify.app, or render.com, it's production
    isProduction = hostname.includes('vercel.app') || 
                   hostname.includes('netlify.app') || 
                   hostname.includes('render.com') ||
                   (!hostname.includes('localhost') && hostname !== '127.0.0.1')
  }
  
  // Also check env variables
  if (!isProduction) {
    isProduction = import.meta.env.PROD === true || import.meta.env.MODE === 'production'
  }
  
  if (isProduction) {
    const prodUrl = 'https://vaad-m-h.onrender.com'
    return prodUrl
  }

  // 3. Local development
  return 'http://localhost:5000'
}

let API_URL = getApiUrl()

// Ensure API_URL is never empty - use fallback if empty
if (!API_URL || typeof API_URL !== 'string' || API_URL.trim() === '') {
  console.error('❌ API_URL is empty or invalid! Using fallback...')
  // Fallback to Render backend URL
  API_URL = 'https://vaad-m-h.onrender.com'
  console.warn(`⚠️  Using fallback URL: ${API_URL}`)
}

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', API_URL)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - PROD mode:', import.meta.env.PROD)
  console.log('  - Window hostname:', window.location.hostname)
  console.log('✅ Using API URL:', API_URL)
}

// Default fallback URL - always use Render backend as fallback
const FALLBACK_API_URL = 'https://vaad-m-h.onrender.com'

const client = axios.create({
  baseURL: API_URL || FALLBACK_API_URL, // Use fallback if API_URL is empty
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Ensure baseURL is always set - use fallback if empty
  let baseURL = config.baseURL || API_URL || FALLBACK_API_URL
  if (!baseURL || typeof baseURL !== 'string' || baseURL.trim() === '') {
    // Fallback to Render backend URL
    baseURL = FALLBACK_API_URL
    console.warn('⚠️  baseURL was empty in interceptor! Using fallback:', baseURL)
  }
  config.baseURL = baseURL
  
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
