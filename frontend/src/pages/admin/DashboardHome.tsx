import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import client from '../../api/client'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    messages: 0,
    unreadMessages: 0,
    media: 0,
    images: 0,
    videos: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [messagesRes, mediaRes] = await Promise.all([
        client.get('/api/messages'),
        client.get('/api/media'),
      ])

      if (messagesRes.data.success) {
        const messages = messagesRes.data.data
        setStats((prev) => ({
          ...prev,
          messages: messages.length,
          unreadMessages: messages.filter((m: any) => !m.handled).length,
        }))
      }

      if (mediaRes.data.success) {
        const media = mediaRes.data.data
        setStats((prev) => ({
          ...prev,
          media: media.length,
          images: media.filter((m: any) => m.type === 'image').length,
          videos: media.filter((m: any) => m.type === 'video').length,
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">לוח בקרה</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">הודעות</h3>
          <p className="text-3xl font-bold text-gold-DEFAULT">{stats.messages}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.unreadMessages} לא נקראו
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">מדיה</h3>
          <p className="text-3xl font-bold text-gold-DEFAULT">{stats.media}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.images} תמונות, {stats.videos} סרטונים
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/messages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">ניהול הודעות</h3>
          <p className="text-gray-600">צפייה וניהול הודעות מהמבקרים</p>
        </Link>

        <Link
          to="/admin/media"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">ניהול גלריה</h3>
          <p className="text-gray-600">העלאת תמונות וסרטונים לגלריה</p>
        </Link>
      </div>
    </div>
  )
}
