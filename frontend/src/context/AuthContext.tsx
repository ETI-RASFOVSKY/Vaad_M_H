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
      const response = await client.post('/api/auth/login', { email, password })
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
      } else {
        throw new Error('Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          throw new Error('אימייל או סיסמה שגויים')
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
