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
