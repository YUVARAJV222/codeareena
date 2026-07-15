import { useEffect, useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Guard: Restrict non-admins
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  const fetchProblems = () => {
    setLoading(true)
    api.get('/problems')
      .then(res => setProblems(res.data))
      .catch(err => setError('Failed to load problems.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return
    }
    try {
      await api.delete(`/problems/${id}`)
      setProblems(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete problem.')
    }
  }

  return (
    <div className="page admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Admin Problem Management</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Add, edit, or remove coding challenges from the platform.</p>
        </div>
        <Link to="/admin/problems/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>➕ Add New Problem</span>
        </Link>
      </div>

      {error && <div className="error-banner" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '16px' }}>#</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Difficulty</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Tags</th>
                <th style={{ textAlign: 'right', padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="hover-row">
                  <td style={{ padding: '16px', fontWeight: '600' }}>{p.id}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>
                    <Link to={`/problems/${p.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{p.title}</Link>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`difficulty-badge difficulty-${p.difficulty}`}>{p.difficulty}</span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {p.tags ? p.tags.split(',').map(tag => (
                      <span key={tag} style={{
                        display: 'inline-block',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        marginRight: '6px'
                      }}>{tag.trim()}</span>
                    )) : <span style={{ fontStyle: 'italic' }}>None</span>}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/admin/problems/${p.id}/edit`)} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="btn-danger" 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '13px',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
