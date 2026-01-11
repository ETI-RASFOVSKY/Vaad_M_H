import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Debug: log the API URL (will be removed in production)
if (typeof window !== 'undefined') {
  console.log('API_URL:', API_URL)
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL)
}

const client = axios.create({
  baseURL: API_URL,
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
