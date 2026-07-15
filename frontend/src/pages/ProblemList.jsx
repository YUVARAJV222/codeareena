import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'

export default function ProblemList() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/problems')
      .then(res => setProblems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? problems : problems.filter(p => p.difficulty === filter)

  return (
    <div className="page">
      <h1>Problems</h1>

      <div className="filter-bar">
        {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(d => (
          <button
            key={d}
            className={`filter-btn ${filter === d ? 'active' : ''}`}
            onClick={() => setFilter(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Difficulty</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr 
                key={p.id} 
                onClick={() => navigate(`/problems/${p.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{p.id}</td>
                <td>
                  <Link to={`/problems/${p.id}`} onClick={(e) => e.stopPropagation()}>
                    {p.title}
                  </Link>
                </td>
                <td><span className={`difficulty-badge difficulty-${p.difficulty}`}>{p.difficulty}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
