import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import client from '../../api/client'

interface ReplyEmailModalProps {
  isOpen: boolean
  onClose: () => void
  messageId: string
  recipientEmail: string
  recipientName: string
  onSuccess: () => void
}

export default function ReplyEmailModal({
  isOpen,
  onClose,
  messageId,
  recipientEmail,
  recipientName,
  onSuccess,
}: ReplyEmailModalProps) {
  const [subject, setSubject] = useState('תגובה להודעה שלך - ועד מבקשי ה\'')
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError('')

    try {
      const response = await client.post(`/api/email/reply/${messageId}`, {
        subject,
        html: content.replace(/\n/g, '<br>'),
      })

      if (response.data.success) {
        onSuccess()
        onClose()
        setSubject('תגובה להודעה שלך - ועד מבקשי ה\'')
        setContent('')
      } else {
        setError(response.data.error || 'שגיאה בשליחת האימייל')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'שגיאה בשליחת האימייל')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">שלח תגובה</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="סגור"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  אל:
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-sm text-gray-500 mt-1">{recipientName}</p>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  נושא *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  תוכן ההודעה *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="כתבו כאן את התגובה..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  ההודעה תישלח בפורמט HTML. שורות חדשות יתורגמו ל-&lt;br&gt;
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSending}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={isSending || !subject || !content}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'שולח...' : 'שלח תגובה'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
