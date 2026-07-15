import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

const DEFAULT_JAVA = `// The main class name must be 'Solution'.
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Write your code here
    }
}`;

const DEFAULT_PYTHON = `# Read input using input() or sys.stdin.read()
import sys

def solve():
    # Write your code here
    pass

if __name__ == '__main__':
    solve()`;

const DEFAULT_CPP = `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    // Write your code here
    return 0;
}`;

export default function ProblemForm() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  // Guard: Restrict non-admins
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [sampleInput, setSampleInput] = useState('')
  const [sampleOutput, setSampleOutput] = useState('')
  const [constraints, setConstraints] = useState('')
  const [tags, setTags] = useState('')

  // Starter Codes
  const [starterCodeJava, setStarterCodeJava] = useState(DEFAULT_JAVA)
  const [starterCodePython, setStarterCodePython] = useState(DEFAULT_PYTHON)
  const [starterCodeCpp, setStarterCodeCpp] = useState(DEFAULT_CPP)
  const [activeCodeTab, setActiveCodeTab] = useState('JAVA')

  // Test Cases
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get(`/problems/${id}/admin`)
        .then(res => {
          const { problem, testCases } = res.data
          setTitle(problem.title || '')
          setDescription(problem.description || '')
          setDifficulty(problem.difficulty || 'EASY')
          setSampleInput(problem.sampleInput || '')
          setSampleOutput(problem.sampleOutput || '')
          setConstraints(problem.constraints || '')
          setTags(problem.tags || '')
          setStarterCodeJava(problem.starterCodeJava || DEFAULT_JAVA)
          setStarterCodePython(problem.starterCodePython || DEFAULT_PYTHON)
          setStarterCodeCpp(problem.starterCodeCpp || DEFAULT_CPP)
          setTestCases(testCases || [])
        })
        .catch(err => {
          setError('Failed to fetch problem data.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, isEdit])

  const handleAddTestCase = () => {
    setTestCases(prev => [...prev, { input: '', expectedOutput: '', sample: false }])
  }

  const handleRemoveTestCase = (index) => {
    setTestCases(prev => prev.filter((_, i) => i !== index))
  }

  const handleTestCaseChange = (index, field, value) => {
    setTestCases(prev => prev.map((tc, i) => {
      if (i === index) {
        return { ...tc, [field]: value }
      }
      return tc
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Title and Description are required.')
      return
    }
    setSubmitting(true)
    setError('')

    const payload = {
      title,
      description,
      difficulty,
      sampleInput,
      sampleOutput,
      constraints,
      tags,
      starterCodeJava,
      starterCodePython,
      starterCodeCpp,
      testCases
    }

    try {
      if (isEdit) {
        await api.put(`/problems/${id}`, payload)
      } else {
        await api.post('/problems', payload)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save problem.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page"><p>Loading form...</p></div>

  return (
    <div className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1>{isEdit ? '✏️ Edit Problem' : '➕ Create New Problem'}</h1>

      {error && <div className="error-banner" style={{ margin: '16px 0' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        {/* Basic Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Problem Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Two Sum"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Tags (Comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. Array, Hash Table, Two Pointers"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Problem Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={8}
            placeholder="Describe the problem, input format, and output format..."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Constraints</label>
          <textarea
            value={constraints}
            onChange={e => setConstraints(e.target.value)}
            rows={3}
            placeholder="e.g. 1 <= nums.length <= 10^4"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }}
          />
        </div>

        {/* Sample Inputs and Outputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Sample Input</label>
            <textarea
              value={sampleInput}
              onChange={e => setSampleInput(e.target.value)}
              rows={4}
              placeholder="e.g. [2,7,11,15]\n9"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Sample Output</label>
            <textarea
              value={sampleOutput}
              onChange={e => setSampleOutput(e.target.value)}
              rows={4}
              placeholder="e.g. [0,1]"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Custom Starter Code Section */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>💻 Customize Starter Codes</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['JAVA', 'PYTHON', 'CPP'].map(lang => (
              <button
                type="button"
                key={lang}
                className={`filter-btn ${activeCodeTab === lang ? 'active' : ''}`}
                onClick={() => setActiveCodeTab(lang)}
                style={{ padding: '6px 16px', fontSize: '13px' }}
              >
                {lang}
              </button>
            ))}
          </div>

          {activeCodeTab === 'JAVA' && (
            <textarea
              value={starterCodeJava}
              onChange={e => setStarterCodeJava(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '13px' }}
            />
          )}

          {activeCodeTab === 'PYTHON' && (
            <textarea
              value={starterCodePython}
              onChange={e => setStarterCodePython(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '13px' }}
            />
          )}

          {activeCodeTab === 'CPP' && (
            <textarea
              value={starterCodeCpp}
              onChange={e => setStarterCodeCpp(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '13px' }}
            />
          )}
        </div>

        {/* Test Cases Section */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>🧪 Test Cases ({testCases.length})</h3>
            <button
              type="button"
              onClick={handleAddTestCase}
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              ➕ Add Test Case
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {testCases.map((tc, index) => (
              <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>Test Case #{index + 1}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={tc.sample}
                        onChange={e => handleTestCaseChange(index, 'sample', e.target.checked)}
                      />
                      Is Sample Case
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Input</label>
                    <textarea
                      value={tc.input}
                      onChange={e => handleTestCaseChange(index, 'input', e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '12px', marginTop: '4px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Expected Output</label>
                    <textarea
                      value={tc.expectedOutput}
                      onChange={e => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '12px', marginTop: '4px' }}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {testCases.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>No test cases added yet. Please add at least one test case.</p>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '40px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Problem'}
          </button>
        </div>
      </form>
    </div>
  )
}
