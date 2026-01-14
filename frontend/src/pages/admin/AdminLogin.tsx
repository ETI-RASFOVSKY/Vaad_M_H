import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
import client from '../../api/client'

const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'סיסמה נדרשת'),
})

const registerSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
  confirmPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})

const verifySchema = z.object({
  code: z.string().length(6, 'קוד חייב להכיל 6 ספרות'),
})

const verifyResetCodeSchema = z.object({
  code: z.string().min(1, 'קוד נדרש').trim(),
})

const newPasswordSchema = z.object({
  newPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
  confirmPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})

const resetPasswordSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה').optional(),
  code: z.string().min(1, 'קוד נדרש').trim(),
  newPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
  confirmPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>
type VerifyFormData = z.infer<typeof verifySchema>
type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>
type NewPasswordFormData = z.infer<typeof newPasswordSchema>
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

type View = 'login' | 'register' | 'verify' | 'forgot-password' | 'verify-reset-code' | 'reset-password'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [view, setView] = useState<View>('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [verifiedResetCode, setVerifiedResetCode] = useState<string | null>(null)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  })

  const verifyResetCodeForm = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
  })

  const newPasswordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      setSuccess('')
      await login(data.email, data.password)
      navigate('/admin')
    } catch (err: any) {
      const errorMessage = err.message || 'שגיאה בהתחברות. אנא בדקו את הפרטים ונסו שוב.'
      setError(errorMessage)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      setSuccess('')
      const response = await client.post('/api/auth/register', {
        email: data.email,
        password: data.password,
      })

      if (response.data.success) {
        setPendingEmail(data.email)
        setView('verify')
        setSuccess('ההרשמה הצליחה! אנא בדקו את האימייל שלכם לקבלת קוד האימות.')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בהרשמה. אנא נסו שוב.')
    }
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    try {
      setError('')
      setSuccess('')
      const response = await client.post('/api/auth/verify-email', {
        email: pendingEmail,
        code: data.code,
      })

      if (response.data.success) {
        setSuccess('האימייל אומת בהצלחה! כעת תוכלו להתחבר.')
        setTimeout(() => {
          setView('login')
          setPendingEmail('')
          verifyForm.reset()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'קוד אימות שגוי או פג תוקף.')
    }
  }

  const onResendCode = async () => {
    try {
      setError('')
      setSuccess('')
      const response = await client.post('/api/auth/resend-verification', {
        email: pendingEmail,
      })

      if (response.data.success) {
        setSuccess('קוד אימות חדש נשלח לאימייל שלכם.')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשליחת קוד אימות.')
    }
  }

  const onForgotPasswordSubmit = async (data: { email: string }) => {
    try {
      setError('')
      setSuccess('')
      const response = await client.post('/api/auth/forgot-password', {
        email: data.email,
      })

      if (response.data.success) {
        setPendingEmail(data.email)
        setView('verify-reset-code')
        
        // Check if email was actually sent
        if (response.data.debugCode && response.data.debugMessage) {
          setError(`מייל לא נשלח (הגדרת מייל חסרה). קוד איפוס: ${response.data.debugCode}`)
        } else {
          setSuccess('קוד איפוס סיסמה נשלח לאימייל שלכם.')
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשליחת קוד איפוס.')
    }
  }

  const onVerifyResetCodeSubmit = async (data: VerifyResetCodeFormData) => {
    try {
      setError('')
      setSuccess('')
      
      if (!pendingEmail) {
        setError('שגיאה: לא נמצא אימייל. אנא בקשו קוד איפוס מחדש.')
        return
      }
      
      // Normalize code - remove spaces
      const normalizedCode = String(data.code).trim().replace(/\s/g, '')
      
      // Verify the code
      const response = await client.post('/api/auth/verify-reset-code', {
        email: pendingEmail,
        code: normalizedCode,
      })

      if (response.data.success) {
        setVerifiedResetCode(normalizedCode)
        setSuccess('קוד איפוס אומת בהצלחה! כעת תוכלו להזין סיסמה חדשה.')
        setTimeout(() => {
          setView('reset-password')
          verifyResetCodeForm.reset()
        }, 1500)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'קוד איפוס שגוי או פג תוקף.'
      setError(errorMessage)
      console.error('Verify reset code error:', err)
    }
  }

  const onNewPasswordSubmit = async (data: NewPasswordFormData) => {
    try {
      setError('')
      setSuccess('')
      
      if (!pendingEmail) {
        setError('שגיאה: לא נמצא אימייל. אנא בקשו קוד איפוס מחדש.')
        return
      }
      
      if (!verifiedResetCode) {
        setError('שגיאה: קוד איפוס לא מאומת. אנא אמתו את הקוד תחילה.')
        setView('verify-reset-code')
        return
      }
      
      const response = await client.post('/api/auth/reset-password', {
        email: pendingEmail,
        code: verifiedResetCode,
        newPassword: data.newPassword,
      })

      if (response.data.success) {
        setSuccess('הסיסמה אופסה בהצלחה! כעת תוכלו להתחבר.')
        setTimeout(() => {
          setView('login')
          setPendingEmail('')
          newPasswordForm.reset()
          verifyResetCodeForm.reset()
        }, 2000)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'שגיאה באיפוס הסיסמה.'
      setError(errorMessage)
      console.error('Reset password error:', err)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('')
      setSuccess('')
      const response = await client.post('/api/auth/google', {
        token: credentialResponse.credential,
      })

      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        // Reload to update auth context
        window.location.href = '/admin'
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות עם Google.')
    }
  }

  const handleGoogleError = () => {
    setError('שגיאה בהתחברות עם Google.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {view === 'login' && 'התחברות מנהל'}
            {view === 'register' && 'הרשמת מנהל'}
            {view === 'verify' && 'אימות אימייל'}
            {view === 'forgot-password' && 'איפוס סיסמה'}
            {view === 'verify-reset-code' && 'אימות קוד איפוס'}
            {view === 'reset-password' && 'סיסמה חדשה'}
          </h1>
          <p className="text-gray-600">אזור ניהול האתר</p>
        </div>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...loginForm.register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      loginForm.formState.errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gold'
                    }`}
                    placeholder="admin@example.com"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    סיסמה
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...loginForm.register('password')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      loginForm.formState.errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gold'
                    }`}
                    placeholder="••••••••"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot-password')
                      setError('')
                      setSuccess('')
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    שכחתי סיסמה?
                  </button>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginForm.formState.isSubmitting ? 'מתחבר...' : 'התחבר'}
                </button>

                {GOOGLE_CLIENT_ID && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">או</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                      />
                    </div>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('register')
                      setError('')
                      setSuccess('')
                      loginForm.reset()
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    אין לך חשבון? הרשם כאן
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    {...registerForm.register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      registerForm.formState.errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gold'
                    }`}
                    placeholder="admin@example.com"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    סיסמה
                  </label>
                  <input
                    type="password"
                    id="reg-password"
                    {...registerForm.register('password')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      registerForm.formState.errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gold'
                    }`}
                    placeholder="לפחות 8 תווים"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    אימות סיסמה
                  </label>
                  <input
                    type="password"
                    id="reg-confirm-password"
                    {...registerForm.register('confirmPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      registerForm.formState.errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gold'
                    }`}
                    placeholder="הזן שוב את הסיסמה"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerForm.formState.isSubmitting ? 'נרשם...' : 'הרשם'}
                </button>

                {GOOGLE_CLIENT_ID && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">או</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                      />
                    </div>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login')
                      setError('')
                      setSuccess('')
                      registerForm.reset()
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    יש לך חשבון? התחבר כאן
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-6">
                <p className="text-gray-700 text-center">
                  קוד אימות נשלח ל-<strong>{pendingEmail}</strong>
                </p>

                <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="verify-code" className="block text-sm font-semibold text-gray-700 mb-2">
                      קוד אימות
                    </label>
                    <input
                      type="text"
                      id="verify-code"
                      {...verifyForm.register('code')}
                      maxLength={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-center text-2xl tracking-widest ${
                        verifyForm.formState.errors.code
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gold'
                      }`}
                      placeholder="000000"
                    />
                    {verifyForm.formState.errors.code && (
                      <p className="mt-1 text-sm text-red-600">
                        {verifyForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={verifyForm.formState.isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyForm.formState.isSubmitting ? 'מאמת...' : 'אמת אימייל'}
                  </button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={onResendCode}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    לא קיבלתי קוד? שלח שוב
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login')
                      setError('')
                      setSuccess('')
                      setPendingEmail('')
                      verifyForm.reset()
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    חזור להתחברות
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const email = (e.target as HTMLFormElement).email.value
                  onForgotPasswordSubmit({ email })
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="admin@example.com"
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <button type="submit" className="w-full btn-primary">
                  שלח קוד איפוס
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login')
                      setError('')
                      setSuccess('')
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    חזור להתחברות
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'verify-reset-code' && (
            <motion.div
              key="verify-reset-code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-6">
                <p className="text-gray-700 text-center">
                  קוד איפוס נשלח ל-<strong>{pendingEmail}</strong>
                </p>
                <p className="text-sm text-gray-600 text-center">
                  אנא הזינו את הקוד שקיבלתם במייל
                </p>

                <form onSubmit={verifyResetCodeForm.handleSubmit(onVerifyResetCodeSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="verify-reset-code" className="block text-sm font-semibold text-gray-700 mb-2">
                      קוד איפוס
                    </label>
                    <input
                      type="text"
                      id="verify-reset-code"
                      {...verifyResetCodeForm.register('code')}
                      maxLength={20}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-center text-2xl tracking-widest ${
                        verifyResetCodeForm.formState.errors.code
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gold'
                      }`}
                      placeholder="000000"
                    />
                    {verifyResetCodeForm.formState.errors.code && (
                      <p className="mt-1 text-sm text-red-600">
                        {verifyResetCodeForm.formState.errors.code.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={verifyResetCodeForm.formState.isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyResetCodeForm.formState.isSubmitting ? 'מאמת...' : 'אמת קוד'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot-password')
                        setError('')
                        setSuccess('')
                        verifyResetCodeForm.reset()
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      חזור לבקשת קוד חדש
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {view === 'reset-password' && (
            <motion.div
              key="reset-password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-6">
                <p className="text-gray-700 text-center">
                  קוד איפוס אומת בהצלחה!
                </p>
                <p className="text-sm text-gray-600 text-center">
                  כעת תוכלו להזין סיסמה חדשה
                </p>

                <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="reset-new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      סיסמה חדשה
                    </label>
                    <input
                      type="password"
                      id="reset-new-password"
                      {...newPasswordForm.register('newPassword')}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        newPasswordForm.formState.errors.newPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gold'
                      }`}
                      placeholder="לפחות 8 תווים"
                    />
                    {newPasswordForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {newPasswordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reset-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      אימות סיסמה
                    </label>
                    <input
                      type="password"
                      id="reset-confirm-password"
                      {...newPasswordForm.register('confirmPassword')}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        newPasswordForm.formState.errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gold'
                      }`}
                      placeholder="הזן שוב את הסיסמה"
                    />
                    {newPasswordForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {newPasswordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={newPasswordForm.formState.isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newPasswordForm.formState.isSubmitting ? 'מאפס...' : 'אפס סיסמה'}
                  </button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login')
                      setError('')
                      setSuccess('')
                      setPendingEmail('')
                      resetPasswordForm.reset()
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    חזור להתחברות
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
