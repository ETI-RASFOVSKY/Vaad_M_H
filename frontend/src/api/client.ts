import axios from 'axios'

// Get API URL and process it
const rawApiUrl = import.meta.env.VITE_API_URL

// Fallback URL (default)
const FALLBACK_URL = 'https://vaad-m-h.onrender.com'

// Process and validate API URL
let API_URL = ''

// Debug: Check raw value initially
if (rawApiUrl) {
  console.log('🔍 RAW VITE_API_URL detected, length:', rawApiUrl.length)
}

if (rawApiUrl && typeof rawApiUrl === 'string') {
  // Trim and clean: remove ALL types of whitespace
  let cleaned = rawApiUrl.trim().replace(/[\s\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, '')
  
  // Validate: must be a valid URL (more than 10 chars and starts with http)
  if (cleaned && cleaned.length > 10 && cleaned.startsWith('http')) {
    API_URL = cleaned
    console.log('✅ Using VITE_API_URL from environment:', API_URL)
  } else {
    console.warn('⚠️ VITE_API_URL contains only spaces or is invalid, using fallback')
    API_URL = FALLBACK_URL
  }
} else {
  console.warn('⚠️ VITE_API_URL is not set, using fallback')
  API_URL = FALLBACK_URL
}

// Final safety check
if (!API_URL || API_URL.trim().length === 0 || !API_URL.startsWith('http')) {
  API_URL = FALLBACK_URL
}

console.log('🚀 Final API_URL being used:', API_URL)

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
  
  // Log every request to track connection
  console.log(`📡 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  
  return config
})

export default client