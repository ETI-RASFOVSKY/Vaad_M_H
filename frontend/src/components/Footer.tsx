import { Link } from 'react-router-dom'
import logo from '/logo.svg'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <img src={logo} alt="ועד מבקשי ה'" className="h-16 w-auto mb-4" />
            <p className="text-gray-400 text-sm">
              ארגון המעניק מענה אמיתי ומתמשך לבחורים במצבים רבים ושונים
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold transition-colors">
                  אודותינו
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-gold transition-colors">
                  גלריה
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold transition-colors">
                  צור קשר
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-400 hover:text-gold transition-colors">
                  תרומה
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">יצירת קשר</h3>
            <p className="text-gray-400 text-sm mb-2">
              לכל שאלה או פנייה, אנא השתמשו בטופס יצירת הקשר
            </p>
            <Link
              to="/contact"
              className="inline-block mt-4 btn-primary"
            >
              צור קשר
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ועד מבקשי ה'. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  )
}
