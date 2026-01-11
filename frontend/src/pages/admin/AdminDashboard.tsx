import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import MediaManager from './MediaManager'
import MessagesManager from './MessagesManager'
import DashboardHome from './DashboardHome'

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/admin/login')
    return null
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
