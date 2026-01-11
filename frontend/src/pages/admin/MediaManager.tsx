import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import client from '../../api/client'

interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  category: string | null
  title: string | null
  description: string | null
  createdAt: string
}

export default function MediaManager() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await client.get('/api/media')
      if (response.data.success) {
        setMedia(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)

      const response = await client.post('/api/media/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        await fetchMedia()
        setFormData({ category: '', title: '', description: '' })
        setShowUploadForm(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('שגיאה בהעלאת הקובץ')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) return

    try {
      await client.delete(`/api/media/${id}`)
      await fetchMedia()
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('שגיאה במחיקת הפריט')
    }
  }

  if (loading) {
    return <div className="text-center py-12">טוען...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ניהול גלריה</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary"
        >
          {showUploadForm ? 'ביטול' : 'העלה מדיה חדשה'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">העלאת מדיה</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                קטגוריה (אופציונלי)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">בחר קטגוריה</option>
                <option value="hanukkah">חנוכה</option>
                <option value="lag-baomer">ל"ג בעומר</option>
                <option value="shabbat">שבת גיבוש</option>
                <option value="general">כללי</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                כותרת (אופציונלי)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="כותרת לתמונה/סרטון"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                תיאור (אופציונלי)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="תיאור קצר"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                קובץ
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            {uploading && (
              <div className="text-center text-gray-600">מעלה...</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-video">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title || 'תמונה'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
            </div>
            <div className="p-4">
              {item.title && (
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              )}
              {item.category && (
                <p className="text-sm text-gray-600 mb-2">קטגוריה: {item.category}</p>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                מחק
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          אין מדיה להצגה
        </div>
      )}
    </div>
  )
}
