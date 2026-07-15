import { createContext, useContext, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('codearena_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, ...userData } = res.data
    localStorage.setItem('codearena_token', token)
    localStorage.setItem('codearena_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token, ...userData } = res.data
    localStorage.setItem('codearena_token', token)
    localStorage.setItem('codearena_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const loginWithGoogle = async (idToken) => {
    const res = await api.post('/auth/google', { idToken })
    const { token, ...userData } = res.data
    localStorage.setItem('codearena_token', token)
    localStorage.setItem('codearena_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('codearena_token')
    localStorage.removeItem('codearena_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
