import { motion } from 'framer-motion'

export default function Donate() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="section-container bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            תרומה והשתתפות
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            תמיכתכם מאפשרת לנו להמשיך ולחזק את הבחורים והאברכים,
            להעניק מענה אישי ולקיים את הפעילות השוטפת של הארגון.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-gold-50 to-gold-100 p-12 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              שותפים בדרך
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              כל תרומה, גדולה כקטנה, תורמת להמשך הפעילות החשובה של הארגון.
              אנו מודים לכם על שותפותכם ועל האמון שנתתם בנו.
            </p>
            <motion.a
              href="https://www.matara.pro/nedarimplus/online/?mosad=7004497"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block btn-primary text-xl px-12 py-5"
            >
              לתרומה דרך נדרים פלוס
            </motion.a>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-white p-8 rounded-lg shadow-md"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">למה חשוב לתמוך?</h3>
            <ul className="text-gray-700 space-y-3 text-right">
              <li className="flex items-start">
                <span className="ml-3 text-gold">✓</span>
                <span>תמיכה בהמשך קיום הועדים השבועיים בערים השונות</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-gold">✓</span>
                <span>אפשרות להעניק מענה אישי לבחורים הזקוקים לכך</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-gold">✓</span>
                <span>קיום אירועים מיוחדים ושבתות גיבוש</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 text-gold">✓</span>
                <span>הרחבת הפעילות לערים נוספות</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
