import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

const TEMPLATES = {
  PYTHON3: `# Write your Python 3 solution here.
# Read input using input() or sys.stdin.read()
import sys

def solve():
    # Write your code here
    # Example: read line and print
    # line = sys.stdin.readline().strip()
    pass

if __name__ == '__main__':
    solve()`,
  JAVA: `// Write your Java solution here.
// The main class name must be 'Solution'.
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Write your code here
    }
}`,
  JAVASCRIPT: `// Write your JavaScript (Node.js) solution here.
// Read input from standard input
const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    // Write your code here
}

solve();`,
  C: `// Write your C solution here.
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your code here
    return 0;
}`,
  CPP: `// Write your C++ solution here.
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    // Write your code here
    return 0;
}`
};

export default function ProblemDetail() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [language, setLanguage] = useState('PYTHON3')
  const [leftTab, setLeftTab] = useState('description')
  const [codes, setCodes] = useState(TEMPLATES)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [checkResult, setCheckResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setResult(null)
    setCheckResult(null)
    api.get(`/problems/${id}`)
      .then(res => {
        setProblem(res.data)
        setCodes(prev => ({
          ...prev,
          JAVA: res.data.starterCodeJava || TEMPLATES.JAVA,
          PYTHON3: res.data.starterCodePython || TEMPLATES.PYTHON3,
          CPP: res.data.starterCodeCpp || TEMPLATES.CPP
        }))
      })
      .catch(() => setError('Problem not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCodeChange = (val) => {
    setCodes(prev => ({ ...prev, [language]: val }))
  }

  const handleCheck = async () => {
    setChecking(true)
    setError('')
    setCheckResult(null)
    setResult(null)
    try {
      const res = await api.post('/submissions/check', {
        problemId: Number(id),
        code: codes[language],
        language
      })
      setCheckResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Check failed. Are you logged in?')
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    setResult(null)
    setCheckResult(null)
    try {
      const res = await api.post('/submissions', {
        problemId: Number(id),
        code: codes[language],
        language
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Are you logged in?')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page"><p>Loading problem...</p></div>
  if (error && !problem) return <div className="page"><p className="error-banner">{error}</p></div>
  if (!problem) return null

  return (
    <div className="page problem-detail">
      <div className="problem-panel">
        <h1>{problem.title}</h1>
        <span className={`difficulty-badge difficulty-${problem.difficulty}`}>{problem.difficulty}</span>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', margin: '20px 0 24px 0', gap: '8px' }}>
          <button
            onClick={() => setLeftTab('description')}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: leftTab === 'description' ? '2px solid var(--primary)' : 'none',
              color: leftTab === 'description' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          >
            Description
          </button>
          <button
            onClick={() => setLeftTab('solution')}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: leftTab === 'solution' ? '2px solid var(--primary)' : 'none',
              color: leftTab === 'solution' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          >
            Solution
          </button>
        </div>

        {leftTab === 'description' ? (
          <>
            <pre className="problem-description">{problem.description}</pre>

            {(problem.expectedTimeComplexity || problem.expectedSpaceComplexity) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                margin: '24px 0',
                padding: '16px',
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '13px'
              }}>
                {problem.expectedTimeComplexity && (
                  <div>
                    <strong style={{ color: 'var(--text-secondary)' }}>Expected Time Complexity:</strong>{' '}
                    <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)' }}>
                      {problem.expectedTimeComplexity}
                    </code>
                  </div>
                )}
                {problem.expectedSpaceComplexity && (
                  <div style={{ marginTop: problem.expectedTimeComplexity ? '4px' : '0' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Expected Space Complexity:</strong>{' '}
                    <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)' }}>
                      {problem.expectedSpaceComplexity}
                    </code>
                  </div>
                )}
              </div>
            )}

            <h3>Sample Input</h3>
            <pre className="code-block">{problem.sampleInput}</pre>

            <h3>Sample Output</h3>
            <pre className="code-block">{problem.sampleOutput}</pre>

            {problem.constraints && (
              <>
                <h3>Constraints</h3>
                <pre className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{problem.constraints}</pre>
              </>
            )}
          </>
        ) : (
          <div>
            {problem.solution ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <pre className="problem-description" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {problem.solution}
                </pre>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No solution explanation available for this problem yet.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="editor-panel">
        <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <label htmlFor="language-select" style={{ marginRight: '8px', fontWeight: '600', fontSize: '14px' }}>Language:</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="PYTHON3">Python 3</option>
              <option value="JAVA">Java</option>
              <option value="JAVASCRIPT">JavaScript (Node.js)</option>
              <option value="C">C (gcc)</option>
              <option value="CPP">C++ (g++)</option>
            </select>
          </div>
        </div>

        <textarea
          className="code-editor"
          value={codes[language]}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck={false}
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button className="btn-secondary" onClick={handleCheck} disabled={checking || submitting} style={{ flex: 1 }}>
            {checking ? 'Checking...' : 'Check Code'}
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={checking || submitting} style={{ flex: 1 }}>
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>

        {error && <div className="error-banner" style={{ marginTop: '16px' }}>{error}</div>}

        {checkResult && (
          <div className="check-results-panel" style={{ marginTop: '20px' }}>
            {checkResult.passed ? (
              <div className="alert-success" style={{
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✅ All Sample Test Cases Passed!</span>
              </div>
            ) : (
              <div className="alert-danger" style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>❌ Some Test Cases Failed. Check details below:</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {checkResult.testCases.map((tc, index) => (
                <div key={index} style={{
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'var(--bg-secondary)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0 }}>Sample Test Case #{index + 1}</h4>
                    <span className={tc.status === 'ACCEPTED' ? 'status-badge status-ACCEPTED' : 'status-badge status-WRONG_ANSWER'} style={{
                      backgroundColor: tc.status === 'ACCEPTED' ? '#dcfce7' : '#fee2e2',
                      color: tc.status === 'ACCEPTED' ? '#166534' : '#991b1b',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {tc.status === 'ACCEPTED' ? 'PASSED' : tc.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <strong>Input:</strong>
                      <pre className="code-block" style={{ marginTop: '4px', padding: '8px' }}>{tc.input}</pre>
                    </div>
                    <div>
                      <strong>Expected Output:</strong>
                      <pre className="code-block" style={{ marginTop: '4px', padding: '8px' }}>{tc.expectedOutput}</pre>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '13px' }}>
                    <strong>Actual Output / Error:</strong>
                    <pre className="code-block" style={{
                      marginTop: '4px',
                      padding: '8px',
                      backgroundColor: tc.status === 'ACCEPTED' ? '#f8fafc' : '#fef2f2',
                      borderColor: tc.status === 'ACCEPTED' ? 'var(--border)' : '#fca5a5',
                      color: tc.status === 'ACCEPTED' ? 'var(--text-primary)' : '#b91c1c',
                      whiteSpace: 'pre-wrap'
                    }}>{tc.actualOutput || '(no output)'}</pre>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Execution Time: {tc.executionTimeMs} ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={`result-card status-${result.status}`} style={{ marginTop: '20px' }}>
            <h3>Verdict: {result.status}</h3>
            <p>Execution time: {result.executionTimeMs} ms</p>
            <pre className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{result.output}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
