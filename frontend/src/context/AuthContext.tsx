import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import client from '../api/client'

interface User {
  id: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      verifyToken(storedToken)
    }
  }, [])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await client.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      })
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        localStorage.removeItem('token')
        setToken(null)
      }
    } catch (error: any) {
      // Silently fail verification - user just needs to login again
      console.debug('Token verification failed:', error.message)
      localStorage.removeItem('token')
      setToken(null)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email)
      const response = await client.post('/api/auth/login', { email, password })
      console.log('✅ Login response received:', {
        status: response.status,
        success: response.data.success,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user
      })
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
        console.log('✅ Login successful, token saved')
      } else {
        console.error('❌ Login failed - success is false')
        throw new Error('Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response) {
        // Server responded with error
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        if (error.response.status === 401) {
          const errorMessage = error.response.data?.error || 'אימייל או סיסמה שגויים'
          throw new Error(errorMessage)
        } else if (error.response.status === 403) {
          const errorMessage = error.response.data?.error || 'האימייל לא אומת'
          throw new Error(errorMessage)
        } else if (error.response.status === 404) {
          throw new Error('שרת לא נמצא. אנא בדקו את חיבור ה-API.')
        } else {
          throw new Error(error.response.data?.error || 'שגיאה בהתחברות')
        }
      } else if (error.request) {
        // Network error
        throw new Error('לא ניתן להתחבר לשרת. אנא בדקו את החיבור.')
      } else {
        throw new Error(error.message || 'שגיאה בהתחברות')
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
