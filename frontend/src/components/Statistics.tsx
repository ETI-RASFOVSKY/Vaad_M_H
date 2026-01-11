import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  value: number
  label: string
  suffix?: string
}

const stats: StatItem[] = [
  { value: 15, label: 'ועדים פעילים', suffix: '+' },
  { value: 10, label: 'ערים', suffix: '+' },
  { value: 500, label: 'משתתפים', suffix: '+' },
  { value: 5, label: 'שנות פעילות', suffix: '+' },
]

function Counter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default function Statistics() {
  return (
    <section className="section-container bg-gradient-to-b from-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          הפעילות במספרים
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl md:text-6xl font-bold text-gold-DEFAULT mb-2">
              <Counter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-lg md:text-xl text-gray-700 font-semibold">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
