import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProblemList from './pages/ProblemList'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import AdminDashboard from './pages/AdminDashboard'
import ProblemForm from './pages/ProblemForm'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/problems" element={
          <ProtectedRoute><ProblemList /></ProtectedRoute>
        } />
        <Route path="/problems/:id" element={
          <ProtectedRoute><ProblemDetail /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute><Leaderboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/problems/new" element={
          <ProtectedRoute><ProblemForm /></ProtectedRoute>
        } />
        <Route path="/admin/problems/:id/edit" element={
          <ProtectedRoute><ProblemForm /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}
