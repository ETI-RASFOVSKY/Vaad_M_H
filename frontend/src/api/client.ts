import axios from 'axios'

// Get API URL and process it
const rawApiUrl = import.meta.env.VITE_API_URL

// Fallback URL (default)
const FALLBACK_URL = 'https://vaad-m-h.onrender.com'

// Debug: Check raw value
if (rawApiUrl) {
  console.log('🔍 RAW VITE_API_URL:', rawApiUrl)
  console.log('🔍 RAW length:', rawApiUrl.length)
  console.log('🔍 RAW charCodes:', Array.from(rawApiUrl).map(c => c.charCodeAt(0)).join(','))
}

// Process and validate API URL
let API_URL = ''

if (rawApiUrl && typeof rawApiUrl === 'string') {
  // Trim and clean
  let cleaned = rawApiUrl.trim()
  // Remove all types of whitespace
  cleaned = cleaned.replace(/[\s\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, '')
  
  // Validate: must be a valid URL
  if (cleaned && cleaned.length > 10 && cleaned.startsWith('http')) {
    API_URL = cleaned
    console.log('✅ Using VITE_API_URL from environment:', API_URL)
  } else {
    console.warn('⚠️ VITE_API_URL is not valid, using fallback')
    console.warn('⚠️ Raw value was:', JSON.stringify(rawApiUrl))
    API_URL = FALLBACK_URL
  }
} else {
  console.warn('⚠️ VITE_API_URL is not set, using fallback')
  API_URL = FALLBACK_URL
}

// Final validation - always use fallback if something went wrong
if (!API_URL || !API_URL.startsWith('http')) {
  console.error('❌ CRITICAL: API_URL is invalid, forcing fallback')
  API_URL = FALLBACK_URL
}

console.log('🔍 Final API_URL:', API_URL)

const client = axios.create({
  baseURL: API_URL, // Already validated above
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug: Check axios config
console.log('🔍 AXIOS BASE URL:', client.defaults.baseURL)
console.log('🔍 FULL CONFIG:', client.defaults)

// Add token to requests if available
client.interceptors.request.use((config) => {
  // Debug: Check config before request
  console.log('🔍 Request config:', {
    baseURL: config.baseURL,
    url: config.url,
    fullURL: (config.baseURL || '') + (config.url || ''),
  })
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
