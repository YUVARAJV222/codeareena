import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = searchParams.get('token')
    if (t) {
      setToken(t)
    } else {
      setError('Invalid reset request. Missing reset token.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Missing reset token.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword })
      setMessage(res.data.message || 'Password has been reset successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} style={{ width: '420px' }}>
        <h2>Reset Password</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 10px 0' }}>
          Enter and confirm your new password below.
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
            textAlign: 'center'
          }}>
            {message}
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              Redirecting you to login in 3 seconds...
            </div>
          </div>
        )}

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          disabled={loading || !!message || !token}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          required
          disabled={loading || !!message || !token}
        />

        <button type="submit" disabled={loading || !!message || !token}>
          {loading ? 'Updating Password...' : 'Reset Password'}
        </button>

        <p className="auth-switch" style={{ marginTop: '16px' }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
