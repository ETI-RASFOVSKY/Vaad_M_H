import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

console.log('API_URL (raw):', API_URL)
console.log('API_URL length:', API_URL?.length)
console.log('🔥 DEPLOY CHECK 2026-01-18 18:40')


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
  return config
})

export default client
