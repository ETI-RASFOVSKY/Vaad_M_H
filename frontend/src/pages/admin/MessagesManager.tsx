import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import client from '../../api/client'

interface Message {
  id: string
  name: string
  email: string
  content: string
  handled: boolean
  createdAt: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await client.get('/api/messages')
      if (response.data.success) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsHandled = async (id: string) => {
    try {
      await client.patch(`/api/messages/${id}/handle`)
      await fetchMessages()
    } catch (error) {
      console.error('Error marking message as handled:', error)
      alert('שגיאה בעדכון ההודעה')
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.handled
    if (filter === 'read') return msg.handled
    return true
  })

  if (loading) {
    return <div className="text-center py-12">טוען...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ניהול הודעות</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-gold-DEFAULT text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-gold-DEFAULT text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            לא נקראו
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'read'
                ? 'bg-gold-DEFAULT text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            נקראו
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white p-6 rounded-lg shadow-md ${
              !message.handled ? 'border-r-4 border-gold-DEFAULT' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {message.name}
                </h3>
                <p className="text-gray-600">{message.email}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(message.createdAt).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {!message.handled && (
                  <span className="inline-block bg-gold-DEFAULT text-white px-3 py-1 rounded-full text-sm font-semibold">
                    חדש
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{message.content}</p>
            {!message.handled && (
              <button
                onClick={() => handleMarkAsHandled(message.id)}
                className="btn-primary text-sm"
              >
                סמן כטופל
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          אין הודעות להצגה
        </div>
      )}
    </div>
  )
}
