import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function AdminDashboard() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/problems')
      setProblems(res.data)
    } catch (err) {
      setError('Failed to load problems.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/problems/${id}`)
      setProblems(problems.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError('Failed to delete the problem.')
    }
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <Link to="/admin/problems/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          Add New Problem
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading problems...</p>
      ) : problems.length === 0 ? (
        <div className="empty-state">No problems available. Add some to get started!</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Created At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map(problem => (
                <tr key={problem.id}>
                  <td>{problem.id}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{problem.title}</td>
                  <td>
                    <span className={`difficulty-badge difficulty-${problem.difficulty}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    {problem.tags ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {problem.tags.split(',').map((tag, idx) => (
                          <span key={idx} style={{
                            fontSize: '11px',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)'
                          }}>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/problems/${problem.id}/edit`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Edit
                      </Link>
                      {deleteConfirm === problem.id ? (
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button
                            onClick={() => handleDelete(problem.id)}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px'
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(problem.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}
                        >
                          Delete
                        </button>
                      )}
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
