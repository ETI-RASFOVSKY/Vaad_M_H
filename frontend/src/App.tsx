import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { AuthProvider } from './context/AuthContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  // Only wrap with GoogleOAuthProvider if client ID is provided
  const AppContent = () => (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="donate" element={<Donate />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  )

  // If Google Client ID is not set, render without GoogleOAuthProvider
  if (!GOOGLE_CLIENT_ID) {
    return <AppContent />
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  )
}

export default App
