import { useEffect, useState } from 'react'
import api from '../api/api'

export default function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leaderboard')
      .then(res => setEntries(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <h1>🏆 Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p className="empty-state">No submissions yet. Be the first to solve a problem!</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Rank</th><th>Name</th><th>Problems Solved</th></tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.userId}>
                <td>{e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : e.rank}</td>
                <td>{e.name}</td>
                <td>{e.solvedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
