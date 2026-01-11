import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '/logo.svg'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img src={logo} alt="ועד מבקשי ה'" className="h-12 w-auto" />
              <h1 className="text-xl font-bold text-gray-900">אזור ניהול</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                to="/"
                className="text-gray-700 hover:text-gold-DEFAULT transition-colors"
              >
                חזרה לאתר
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            <Link
              to="/admin"
              className="px-4 py-4 border-b-2 border-transparent hover:border-gold-DEFAULT transition-colors"
            >
              לוח בקרה
            </Link>
            <Link
              to="/admin/messages"
              className="px-4 py-4 border-b-2 border-transparent hover:border-gold-DEFAULT transition-colors"
            >
              הודעות
            </Link>
            <Link
              to="/admin/media"
              className="px-4 py-4 border-b-2 border-transparent hover:border-gold-DEFAULT transition-colors"
            >
              גלריה
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
