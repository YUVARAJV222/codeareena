import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [problemCount, setProblemCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [subsRes, problemsRes] = await Promise.all([
          api.get('/submissions/me'),
          api.get('/problems')
        ])
        setSubmissions(subsRes.data)
        setProblemCount(problemsRes.data.length)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const solvedCount = new Set(
    submissions.filter(s => s.status === 'ACCEPTED').map(s => s.problemId)
  ).size

  return (
    <div className="page">
      <h1>Welcome, {user?.name} 👋</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{problemCount}</div>
          <div className="stat-label">Total Problems</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{solvedCount}</div>
          <div className="stat-label">Problems Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{submissions.length}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
      </div>

      <div className="quick-links">
        <Link to="/problems" className="btn-primary">Solve Problems</Link>
        <Link to="/leaderboard" className="btn-secondary">View Leaderboard</Link>
      </div>

      <h2>Recent Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="empty-state">No submissions yet. Go solve your first problem!</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Problem ID</th><th>Language</th><th>Status</th><th>Time</th></tr>
          </thead>
          <tbody>
            {submissions.slice(0, 10).map(s => (
              <tr key={s.id}>
                <td>#{s.problemId}</td>
                <td>{s.language}</td>
                <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                <td>{s.executionTimeMs} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
