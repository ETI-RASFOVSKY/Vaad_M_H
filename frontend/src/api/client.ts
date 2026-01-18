import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Debug: Check all variations
console.log('🔍 RAW:', import.meta.env.VITE_API_URL)
console.log('🔍 TRIM:', import.meta.env.VITE_API_URL?.trim())
console.log('🔍 JSON:', JSON.stringify(import.meta.env.VITE_API_URL))
console.log('🔍 API_URL (raw):', API_URL)
console.log('🔍 API_URL length:', API_URL?.length)
console.log('🔥 DEPLOY CHECK 2026-01-18 18:40')

const client = axios.create({
  baseURL: API_URL,
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
