import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import client from '../api/client'

interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  category: string | null
  title: string | null
  description: string | null
}

const categories = [
  { value: 'all', label: 'הכל' },
  { value: 'image', label: 'תמונות' },
  { value: 'video', label: 'סרטונים' },
  { value: 'hanukkah', label: 'חנוכה' },
  { value: 'lag-baomer', label: "ל\"ג בעומר" },
]

export default function Gallery() {
  const [media, setMedia] = useState<Media[]>([])
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  useEffect(() => {
    filterMedia()
  }, [selectedCategory, media])

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

  const filterMedia = () => {
    if (selectedCategory === 'all') {
      setFilteredMedia(media)
    } else if (selectedCategory === 'image' || selectedCategory === 'video') {
      setFilteredMedia(media.filter((item) => item.type === selectedCategory))
    } else {
      setFilteredMedia(media.filter((item) => item.category === selectedCategory))
    }
  }

  const openLightbox = (item: Media) => {
    setSelectedMedia(item)
  }

  const closeLightbox = () => {
    setSelectedMedia(null)
  }

  if (loading) {
    return (
      <div className="section-container min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">טוען...</div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="section-container bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            גלריה
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            תמונות וסרטונים מפעילות הארגון
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="section-container">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category.value
                  ? 'bg-gold-DEFAULT text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">אין תוכן להצגה</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                onClick={() => openLightbox(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title || 'תמונה'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white opacity-75"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                )}
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold">{item.title}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
                aria-label="סגור"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || 'תמונה'}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh]"
                />
              )}
              {selectedMedia.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  <h3 className="text-xl font-semibold mb-2">{selectedMedia.title}</h3>
                  {selectedMedia.description && (
                    <p className="text-gray-300">{selectedMedia.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
