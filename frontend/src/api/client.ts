import axios from 'axios'

// Backend URL configuration - use string literals to avoid minification issues
const PRODUCTION_API_URL = 'https://vaad-m-h.onrender.com'

// Get API URL based on environment (runtime check only)
const getApiUrl = (): string => {
  // 1. Explicit env (Vercel / local) - should be full URL without /api
  const viteApiUrl = import.meta.env.VITE_API_URL
  if (viteApiUrl && typeof viteApiUrl === 'string' && viteApiUrl.trim() !== '') {
    const url = viteApiUrl.trim()
    // Remove trailing /api if present
    const cleanUrl = url.replace(/\/api\/?$/, '')
    if (cleanUrl && cleanUrl.length > 0) {
      return cleanUrl
    }
  }

  // 2. Runtime check: Check hostname (only works in browser, not during build)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname
    // If hostname includes vercel.app, netlify.app, or render.com, it's production
    if (hostname.includes('vercel.app') || 
        hostname.includes('netlify.app') || 
        hostname.includes('render.com')) {
      return 'https://vaad-m-h.onrender.com'
    }
    // If hostname is localhost, use local URL
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      return 'http://localhost:5000'
    }
    // Otherwise, assume production
    return 'https://vaad-m-h.onrender.com'
  }

  // 3. Build-time check: Use env variables (less reliable in Vercel)
  if (import.meta.env.PROD === true || import.meta.env.MODE === 'production') {
    return 'https://vaad-m-h.onrender.com'
  }

  // 4. Default to local development (fallback)
  return 'http://localhost:5000'
}

// Get the API URL - ensure it's never empty
const resolvedApiUrl = getApiUrl()

// Final safety check - ensure resolvedApiUrl is never empty
let finalApiUrl: string
if (!resolvedApiUrl || typeof resolvedApiUrl !== 'string' || resolvedApiUrl.trim() === '') {
  console.error('❌ API_URL is empty or invalid! Using production fallback...')
  finalApiUrl = 'https://vaad-m-h.onrender.com'
} else {
  finalApiUrl = resolvedApiUrl.trim()
}

// Double-check: ensure finalApiUrl is never empty (use string literal directly)
if (!finalApiUrl || finalApiUrl.length === 0) {
  finalApiUrl = 'https://vaad-m-h.onrender.com'
}

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', finalApiUrl)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - PROD mode:', import.meta.env.PROD)
  console.log('  - MODE:', import.meta.env.MODE)
  console.log('  - Window hostname:', window.location.hostname)
  console.log('  - PRODUCTION_API_URL constant:', PRODUCTION_API_URL)
  console.log('✅ Using API URL:', finalApiUrl)
}

// Create axios client with explicit baseURL (use string literal as final fallback)
const client = axios.create({
  baseURL: finalApiUrl || 'https://vaad-m-h.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Ensure baseURL is always set - use production URL directly as string literal if empty
  if (!config.baseURL || typeof config.baseURL !== 'string' || config.baseURL.trim() === '') {
    config.baseURL = 'https://vaad-m-h.onrender.com'
    console.warn('⚠️  baseURL was empty in interceptor! Using production URL: https://vaad-m-h.onrender.com')
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
