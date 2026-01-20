import axios from 'axios'

// Get API URL and trim whitespace
const rawApiUrl = import.meta.env.VITE_API_URL

// Debug: Check all variations with detailed info
console.log('🔍 RAW:', rawApiUrl)
console.log('🔍 RAW type:', typeof rawApiUrl)
console.log('🔍 RAW length:', rawApiUrl?.length)
console.log('🔍 RAW charCodes:', rawApiUrl ? Array.from(rawApiUrl).map(c => c.charCodeAt(0)).join(',') : 'null')
console.log('🔍 JSON:', JSON.stringify(rawApiUrl))
console.log('🔍 TRIM:', rawApiUrl?.trim())
console.log('🔍 TRIM length:', rawApiUrl?.trim()?.length)

// Aggressive trimming - remove all whitespace including non-breaking spaces
let API_URL = rawApiUrl?.trim() || ''
// Remove all types of whitespace
API_URL = API_URL.replace(/[\s\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, '')

console.log('🔍 API_URL (after aggressive trim):', API_URL)
console.log('🔍 API_URL length:', API_URL?.length)

// Validate API URL
if (!API_URL || API_URL.length < 10 || !API_URL.startsWith('http')) {
  console.error('❌ ERROR: VITE_API_URL is not set correctly!')
  console.error('❌ Raw value:', JSON.stringify(rawApiUrl))
  console.error('❌ After trim:', JSON.stringify(API_URL))
  console.error('❌ Value length:', rawApiUrl?.length)
  console.error('❌ Please check Vercel Environment Variables')
  console.error('❌ Make sure VITE_API_URL = https://vaad-m-h.onrender.com (no spaces, no quotes)')
  console.error('❌ If using multiple environments, check ALL of them (Production, Preview, Development)')
  
  // Use fallback
  API_URL = 'https://vaad-m-h.onrender.com'
  console.warn('⚠️ Using fallback URL:', API_URL)
}

const client = axios.create({
  baseURL: API_URL || 'https://vaad-m-h.onrender.com', // Fallback if not set
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
