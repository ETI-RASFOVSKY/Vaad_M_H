import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoHero from '../components/VideoHero'
import Statistics from '../components/Statistics'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Video */}
      <VideoHero />

      {/* Mission Section */}
      <section className="section-container bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            ועד מבקשי השם
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            ארגון בעל יוזמה ייחודית בעולם התורה הישיבתי אשר נותן מענה אמיתי ומתמשך לבחורים במצבים רבים ושונים בדורנו.
            המענה ניתן ומותאם לבחורים רגילים וכך גם לבחורים חלשים ומתקשים, באופן פרטני ובאופן כללי.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about" className="btn-primary">
              קרא עוד
            </Link>
            <a
              href="https://nedarim-plus.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              לתרומה
            </a>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <Statistics />

      {/* CTA Section */}
      <section className="section-container bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow-lg"
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            שותפים בדרך
          </h3>
          <p className="text-gray-700 mb-6">
            תמיכתכם מאפשרת לנו להמשיך ולחזק את הבחורים והאברכים
          </p>
          <Link to="/donate" className="btn-primary text-lg px-8 py-4">
            לתמיכה דרך נדרים פלוס
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
