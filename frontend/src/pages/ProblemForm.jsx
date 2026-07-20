import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/api'

export default function ProblemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [tags, setTags] = useState('')
  const [constraints, setConstraints] = useState('')
  const [sampleInput, setSampleInput] = useState('')
  const [sampleOutput, setSampleOutput] = useState('')
  const [starterCodeJava, setStarterCodeJava] = useState('')
  const [starterCodePython, setStarterCodePython] = useState('')
  const [starterCodeCpp, setStarterCodeCpp] = useState('')
  const [expectedTimeComplexity, setExpectedTimeComplexity] = useState('')
  const [expectedSpaceComplexity, setExpectedSpaceComplexity] = useState('')
  const [solution, setSolution] = useState('')
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', sample: false }])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('java')

  useEffect(() => {
    if (isEdit) {
      fetchProblemDetails()
    }
  }, [id])

  const fetchProblemDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/problems/${id}/admin`)
      const { problem, testCases: tcList } = res.data
      setTitle(problem.title || '')
      setDescription(problem.description || '')
      setDifficulty(problem.difficulty || 'EASY')
      setTags(problem.tags || '')
      setConstraints(problem.constraints || '')
      setSampleInput(problem.sampleInput || '')
      setSampleOutput(problem.sampleOutput || '')
      setStarterCodeJava(problem.starterCodeJava || '')
      setStarterCodePython(problem.starterCodePython || '')
      setStarterCodeCpp(problem.starterCodeCpp || '')
      setExpectedTimeComplexity(problem.expectedTimeComplexity || '')
      setExpectedSpaceComplexity(problem.expectedSpaceComplexity || '')
      setSolution(problem.solution || '')
      if (tcList && tcList.length > 0) {
        setTestCases(tcList.map(tc => ({
          id: tc.id,
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
          sample: tc.sample || false
        })))
      } else {
        setTestCases([{ input: '', expectedOutput: '', sample: false }])
      }
    } catch (err) {
      setError('Failed to load problem details.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', sample: false }])
  }

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases]
    updated[index][field] = value
    setTestCases(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title,
      description,
      difficulty,
      tags,
      constraints,
      sampleInput,
      sampleOutput,
      starterCodeJava: starterCodeJava || null,
      starterCodePython: starterCodePython || null,
      starterCodeCpp: starterCodeCpp || null,
      expectedTimeComplexity: expectedTimeComplexity || null,
      expectedSpaceComplexity: expectedSpaceComplexity || null,
      solution: solution || null,
      testCases: testCases.filter(tc => tc.input.trim() || tc.expectedOutput.trim())
    }

    try {
      if (isEdit) {
        await api.put(`/problems/${id}`, payload)
      } else {
        await api.post('/problems', payload)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save the problem.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Loading problem form...</p></div>

  return (
    <div className="page" style={{ maxWidth: '1400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin" style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ marginTop: '10px', marginBottom: '4px' }}>{isEdit ? 'Edit Problem' : 'Create New Problem'}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure the problem statement, starter templates, and test cases.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column: Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>General Information</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Problem Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Two Sum"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. array, hash-table"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Expected Time Complexity</label>
              <input
                type="text"
                value={expectedTimeComplexity}
                onChange={(e) => setExpectedTimeComplexity(e.target.value)}
                placeholder="e.g. O(N)"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Expected Space Complexity</label>
              <input
                type="text"
                value={expectedSpaceComplexity}
                onChange={(e) => setExpectedSpaceComplexity(e.target.value)}
                placeholder="e.g. O(1)"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={8}
              placeholder="Describe the problem, input format, and output format..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Constraints</label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
              placeholder="e.g. 1 <= nums.length <= 10^4"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Solution Explanation</label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={6}
              placeholder="Describe the solution or write reference code here..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Sample Input</label>
              <textarea
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                rows={4}
                placeholder="Input data..."
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Sample Output</label>
              <textarea
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
                rows={4}
                placeholder="Expected output..."
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Code Templates and Test Cases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Starter Code Section */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Starter Templates (Optional)</h2>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              {['java', 'python', 'cpp'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === lang ? '2px solid var(--primary)' : 'none',
                    color: activeTab === lang ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '13px'
                  }}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              ))}
            </div>

            {activeTab === 'java' && (
              <textarea
                value={starterCodeJava}
                onChange={(e) => setStarterCodeJava(e.target.value)}
                rows={10}
                placeholder="// Write Java Starter Code..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', resize: 'vertical' }}
              />
            )}

            {activeTab === 'python' && (
              <textarea
                value={starterCodePython}
                onChange={(e) => setStarterCodePython(e.target.value)}
                rows={10}
                placeholder="# Write Python Starter Code..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', resize: 'vertical' }}
              />
            )}

            {activeTab === 'cpp' && (
              <textarea
                value={starterCodeCpp}
                onChange={(e) => setStarterCodeCpp(e.target.value)}
                rows={10}
                placeholder="// Write C++ Starter Code..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', resize: 'vertical' }}
              />
            )}
          </div>

          {/* Test Cases Section */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Test Cases ({testCases.length})</h2>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                + Add Test Case
              </button>
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
              {testCases.map((tc, index) => (
                <div key={index} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Test Case #{index + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={tc.sample}
                          onChange={(e) => handleTestCaseChange(index, 'sample', e.target.checked)}
                        />
                        Is Sample
                      </label>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(index)}
                          style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        rows={2}
                        placeholder="Test input..."
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                        rows={2}
                        placeholder="Expected output..."
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Link to="/admin" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Problem'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
