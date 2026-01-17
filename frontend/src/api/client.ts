import axios from 'axios'

// Backend URL configuration
const PRODUCTION_URL = 'https://vaad-m-h.onrender.com'
const LOCAL_URL = 'http://localhost:5000'

// Get API URL based on environment
function getApiUrl(): string {
  // 1. Explicit env (Vercel / local) - should be full URL without /api
  const viteApiUrl = import.meta.env.VITE_API_URL
  console.log('[getApiUrl] Step 1 - VITE_API_URL:', viteApiUrl)
  
  if (viteApiUrl && typeof viteApiUrl === 'string' && viteApiUrl.trim() !== '') {
    const url = viteApiUrl.trim()
    const cleanUrl = url.replace(/\/api\/?$/, '')
    if (cleanUrl && cleanUrl.length > 0) {
      console.log('[getApiUrl] Using VITE_API_URL:', cleanUrl)
      return cleanUrl
    }
  }

  // 2. Runtime check: Check hostname (only works in browser)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname
    console.log('[getApiUrl] Step 2 - Hostname:', hostname)
    
    // If hostname includes vercel.app, netlify.app, or render.com, it's production
    if (hostname.includes('vercel.app') || 
        hostname.includes('netlify.app') || 
        hostname.includes('render.com')) {
      console.log('[getApiUrl] Detected production hostname, using:', PRODUCTION_URL)
      return PRODUCTION_URL
    }
    // If hostname is localhost, use local URL
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      console.log('[getApiUrl] Detected localhost, using:', LOCAL_URL)
      return LOCAL_URL
    }
    // Otherwise, assume production
    console.log('[getApiUrl] Unknown hostname, defaulting to production:', PRODUCTION_URL)
    return PRODUCTION_URL
  }

  // 3. Build-time check: Use env variables
  const isProd = import.meta.env.PROD === true || import.meta.env.MODE === 'production'
  console.log('[getApiUrl] Step 3 - isProd:', isProd, 'PROD:', import.meta.env.PROD, 'MODE:', import.meta.env.MODE)
  
  if (isProd) {
    console.log('[getApiUrl] Build-time production detected, using:', PRODUCTION_URL)
    return PRODUCTION_URL
  }

  // 4. Default to local development
  console.log('[getApiUrl] Step 4 - Defaulting to local:', LOCAL_URL)
  return LOCAL_URL
}

// Get the API URL
let apiUrl = getApiUrl()
console.log('[client.ts] Initial apiUrl from getApiUrl():', apiUrl)

// Ensure apiUrl is never empty - use production URL as fallback
if (!apiUrl || typeof apiUrl !== 'string' || apiUrl.trim() === '') {
  console.error('❌ API_URL is empty or invalid! Using production fallback...')
  apiUrl = PRODUCTION_URL
  console.log('[client.ts] Fallback applied, apiUrl is now:', apiUrl)
} else {
  apiUrl = apiUrl.trim()
  console.log('[client.ts] apiUrl trimmed:', apiUrl)
}

// Final fallback - ensure apiUrl is never empty
const baseURL = apiUrl || PRODUCTION_URL
console.log('[client.ts] Final baseURL:', baseURL)

// Debug logging with string literals
if (typeof window !== 'undefined') {
  console.log('🔗 API Configuration:')
  console.log('  - API_URL:', baseURL)
  console.log('  - VITE_API_URL env:', import.meta.env.VITE_API_URL || '(not set)')
  console.log('  - PROD mode:', import.meta.env.PROD)
  console.log('  - MODE:', import.meta.env.MODE)
  console.log('  - Window hostname:', window.location.hostname)
  console.log('  - Production URL constant:', PRODUCTION_URL)
  console.log('✅ Using API URL:', baseURL)
}

// Create axios client - use string literal directly as final fallback
const client = axios.create({
  baseURL: baseURL || PRODUCTION_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Ensure baseURL is always set - use string literal directly
  if (!config.baseURL || typeof config.baseURL !== 'string' || config.baseURL.trim() === '') {
    config.baseURL = PRODUCTION_URL
    console.warn('⚠️  baseURL was empty in interceptor! Using production URL:', PRODUCTION_URL)
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
