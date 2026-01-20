import axios from 'axios'

// Get API URL and trim whitespace
const rawApiUrl = import.meta.env.VITE_API_URL
const API_URL = rawApiUrl?.trim() || ''

// Debug: Check all variations
console.log('🔍 RAW:', rawApiUrl)
console.log('🔍 TRIM:', API_URL)
console.log('🔍 JSON:', JSON.stringify(rawApiUrl))
console.log('🔍 API_URL (final):', API_URL)
console.log('🔍 API_URL length:', API_URL?.length)

// Validate API URL
if (!API_URL || API_URL.length < 10) {
  console.error('❌ ERROR: VITE_API_URL is not set correctly!')
  console.error('❌ Current value:', JSON.stringify(rawApiUrl))
  console.error('❌ Please set VITE_API_URL in Vercel Environment Variables')
  console.error('❌ Expected format: https://vaad-backend.onrender.com (no trailing slash)')
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
