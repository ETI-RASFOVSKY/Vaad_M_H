import axios from 'axios'

// Backend URL - use string literal directly (will NOT be affected by minification)
const PRODUCTION_BACKEND_URL = 'https://vaad-m-h.onrender.com'

// Get API URL based on environment
function getApiUrl(): string {
  // 1. Explicit env (Vercel / local)
  const viteApiUrl = import.meta.env.VITE_API_URL
  if (viteApiUrl && typeof viteApiUrl === 'string' && viteApiUrl.trim() !== '') {
    const url = viteApiUrl.trim().replace(/\/api\/?$/, '')
    if (url && url.length > 0) {
      return url
    }
  }

  // 2. Runtime check: Check hostname
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname
    if (hostname.includes('vercel.app') || 
        hostname.includes('netlify.app') || 
        hostname.includes('render.com')) {
      return PRODUCTION_BACKEND_URL
    }
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      return 'http://localhost:5000'
    }
    return PRODUCTION_BACKEND_URL
  }

  // 3. Build-time check
  if (import.meta.env.PROD === true || import.meta.env.MODE === 'production') {
    return PRODUCTION_BACKEND_URL
  }

  // 4. Default to local
  return 'http://localhost:5000'
}

// Get API URL and ensure it's never empty
let apiUrl = getApiUrl() || PRODUCTION_BACKEND_URL
apiUrl = (apiUrl.trim() || PRODUCTION_BACKEND_URL)

// Final baseURL - always use production as fallback
const baseURL = apiUrl || PRODUCTION_BACKEND_URL

// Debug logging - log the actual string to verify it's not empty
if (typeof window !== 'undefined') {
  const prodUrl = 'https://vaad-m-h.onrender.com' // String literal for logging
  console.log('🔗 API Configuration:')
  console.log('  - baseURL:', baseURL)
  console.log('  - baseURL length:', baseURL?.length || 0)
  console.log('  - baseURL === prodUrl:', baseURL === prodUrl)
  console.log('  - Production URL (literal):', prodUrl)
  console.log('  - Production URL (constant):', PRODUCTION_BACKEND_URL)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - PROD mode:', import.meta.env.PROD)
  console.log('  - MODE:', import.meta.env.MODE)
  console.log('  - Window hostname:', window.location.hostname)
  console.log('✅ Using API URL:', baseURL)
}

// Create axios client - force production URL if baseURL is somehow empty
const client = axios.create({
  baseURL: (baseURL && baseURL.length > 0) ? baseURL : 'https://vaad-m-h.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - force production URL if baseURL is empty
client.interceptors.request.use((config) => {
  const prodUrl = 'https://vaad-m-h.onrender.com'
  
  if (!config.baseURL || typeof config.baseURL !== 'string' || config.baseURL.trim() === '') {
    config.baseURL = prodUrl
    console.warn('⚠️  baseURL was empty! Forced to:', prodUrl)
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        data: error.response.data,
      })
    } else if (error.request) {
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      })
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default client
