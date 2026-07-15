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

  // Calculations
  const solvedCount = new Set(
    submissions.filter(s => s.status === 'ACCEPTED').map(s => s.problemId)
  ).size

  const acceptedCount = submissions.filter(s => s.status === 'ACCEPTED').length
  const successRate = submissions.length > 0 ? ((acceptedCount / submissions.length) * 100).toFixed(1) : '0.0'

  // Language proficiency
  const langCounts = {}
  submissions.forEach(s => {
    const lang = s.language || 'UNKNOWN'
    langCounts[lang] = (langCounts[lang] || 0) + 1
  })
  const langProficiency = Object.entries(langCounts).map(([lang, count]) => ({
    language: lang === 'PYTHON3' ? 'Python 3' : lang,
    percentage: submissions.length > 0 ? ((count / submissions.length) * 100).toFixed(1) : 0,
    count
  }))

  // Generate 84 days (12 weeks) streak calendar data
  const generateStreakData = () => {
    const data = {}
    submissions.forEach(s => {
      if (s.submittedAt) {
        const dateStr = s.submittedAt.split('T')[0]
        data[dateStr] = (data[dateStr] || 0) + 1
      }
    })

    const cells = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 83)
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek) // Align Sunday

    for (let i = 0; i < 84; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = data[dateStr] || 0

      // Map count to green color level
      let level = 0
      if (count > 0 && count <= 2) level = 1
      else if (count > 2 && count <= 5) level = 2
      else if (count > 5 && count <= 10) level = 3
      else if (count > 10) level = 4

      cells.push({ date: dateStr, count, level })
    }
    return cells
  }

  const streakCells = generateStreakData()

  return (
    <div className="page dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Analyze your progress, track your stats, and tackle new challenges.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/problems" className="btn-primary" style={{ textDecoration: 'none' }}>🚀 Solve Problems</Link>
          <Link to="/leaderboard" className="btn-secondary" style={{ textDecoration: 'none' }}>🏆 Leaderboard</Link>
        </div>
      </div>

      {/* Primary Stats Panel */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{solvedCount}</div>
          <div className="stat-label">Problems Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{submissions.length}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{successRate}%</div>
          <div className="stat-label">Success Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{problemCount}</div>
          <div className="stat-label">Available Challenges</div>
        </div>
      </div>

      <div className="dashboard-layout" style={{ marginTop: '40px' }}>
        {/* Left column: Submissions and Streak */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* GitHub Streak Calendar */}
          <div className="streak-container">
            <h3 style={{ margin: 0 }}>📅 Coding Activity (Last 12 Weeks)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Consistency is key to landing top placement offers.</p>
            <div className="streak-grid-wrapper">
              <div className="streak-days-labels">
                <span>Sun</span>
                <span></span>
                <span>Tue</span>
                <span></span>
                <span>Thu</span>
                <span></span>
                <span>Sat</span>
              </div>
              <div className="streak-grid">
                {streakCells.map((cell, index) => (
                  <div
                    key={index}
                    className={`streak-cell level-${cell.level}`}
                    title={`${cell.count} submissions on ${cell.date}`}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
              <span>Less</span>
              <div className="streak-cell level-0" style={{ margin: 0 }} />
              <div className="streak-cell level-1" style={{ margin: 0 }} />
              <div className="streak-cell level-2" style={{ margin: 0 }} />
              <div className="streak-cell level-3" style={{ margin: 0 }} />
              <div className="streak-cell level-4" style={{ margin: 0 }} />
              <span>More</span>
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <h3 style={{ margin: 0, marginBottom: '16px' }}>🕒 Recent Submissions</h3>
            {loading ? (
              <p>Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p className="empty-state">No submissions recorded. Go solve a problem to start tracking!</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Problem ID</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Execution Time</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 8).map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: '600' }}>
                        <Link to={`/problems/${s.problemId}`}>Problem #{s.problemId}</Link>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {s.language?.toLowerCase()}
                      </td>
                      <td>
                        <span className={`status-badge status-${s.status}`}>{s.status}</span>
                      </td>
                      <td>
                        {s.executionTimeMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right column: Language Proficiency and Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Language Proficiency Card */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: 0, marginBottom: '16px' }}>📊 Language Proficiency</h3>
            {submissions.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Submit code to generate language usage analytics.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {langProficiency.map(lp => (
                  <div key={lp.language}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>{lp.language}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{lp.percentage}% ({lp.count} subs)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${lp.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #3b82f6)', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Interview Tips */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: 0, marginBottom: '12px' }}>💡 Placement Tips</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <li>Practice **Easy** problems to master basic array and string operations.</li>
              <li>Learn optimal **O(N log N)** sorting and searching bounds.</li>
              <li>Always account for edge cases (empty inputs, negative values, integer overflows).</li>
              <li>Maintain a weekly practice streak to improve problem-solving speed.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
