import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setMessage(res.data.message || 'Password reset link has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} style={{ width: '440px' }}>
        <h2>Forgot Password</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 10px 0', lineHeight: '1.6' }}>
          Enter your email address and we'll generate a password reset link.
        </p>

        {error && <div className="error-banner">{error}</div>}
        {message && (
          <div style={{
            background: 'rgba(74, 222, 128, 0.1)',
            color: '#4ade80',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '13px',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            lineHeight: '1.5'
          }}>
            {message}
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '11px' }}>
              ⚙️ Local Dev Hint: Check your Spring Boot backend console logs to copy the reset link!
            </div>
          </div>
        )}

        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. user@codearena.com"
          required
          disabled={loading || !!message}
        />

        <button type="submit" disabled={loading || !!message}>
          {loading ? 'Sending link...' : 'Send Reset Link'}
        </button>

        <p className="auth-switch" style={{ marginTop: '16px' }}>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
