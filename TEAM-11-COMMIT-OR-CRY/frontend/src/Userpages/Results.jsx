import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Results() {
    const location = useLocation()
    const navigate = useNavigate()
    const { rankedResumes, processingSummary } = location.state || {}

    // Helper to download CSV
    const downloadCSV = () => {
        if (!rankedResumes) return
        const headers = ['Rank', 'Resume Name', 'Score', 'Explanation']
        const rows = rankedResumes.map((r, i) => [
            i + 1,
            r.name,
            r.score,
            `"${r.explanation.replace(/"/g, '""')}"`
        ])
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ranked_resumes.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    // Helper to download PDF (simple text version)
    const downloadPDF = () => {
        if (!rankedResumes) return
        const text = `Resume Ranking Results\n\n${rankedResumes.map((r, i) =>
            `Rank: ${i + 1}\nResume: ${r.name}\nScore: ${r.score}\nExplanation: ${r.explanation}\n\n`
        ).join('')}`
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ranked_resumes.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    if (!rankedResumes || rankedResumes.length === 0) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h2 style={{ color: '#984BFE', marginBottom: 16 }}>No Results Found</h2>
                <p style={{ color: '#6c5a99', marginBottom: 24 }}>
                    Unable to process any resumes. Please check your files and try again.
                </p>
                <button
                    style={{
                        background: 'linear-gradient(90deg, #984BFE 0%, #C799FD 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '1em',
                        padding: '10px 28px',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/home')}
                >
                    Back to Home
                </button>
            </div>
        )
    }

    return (
        <div style={{
            width: '100%',
            maxWidth: '900px',
            margin: '40px auto',
            background: 'rgba(152,75,254,0.08)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(28,21,38,0.12)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h2 style={{
                color: '#f4ebff',
                fontWeight: 700,
                fontSize: '2em',
                textAlign: 'center',
                marginBottom: '12px'
            }}>
                Resume Ranking Results
            </h2>
            
            {/* Processing Summary */}
            {processingSummary && (
                <div style={{
                    background: '#f4ebff',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <span style={{ color: '#984BFE', fontWeight: 600 }}>
                        Processing Summary: {processingSummary.successfullyProcessed}/{processingSummary.totalUploaded} files processed successfully
                        {processingSummary.failed > 0 && ` (${processingSummary.failed} failed)`}
                    </span>
                </div>
            )}
            
            <p style={{
                color: '#f4ebff',
                textAlign: 'center',
                marginBottom: '24px',
                fontSize: '1.05em'
            }}>
                Here are your resumes ranked against the job description. Download as CSV or TXT for your records.
            </p>
            
            <div style={{
                width: '100%',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center',
                gap: '18px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={downloadCSV}
                    style={{
                        background: 'linear-gradient(90deg, #984BFE 0%, #C799FD 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '1em',
                        padding: '10px 28px',
                        cursor: 'pointer'
                    }}
                >
                    📊 Download CSV
                </button>
                <button
                    onClick={downloadPDF}
                    style={{
                        background: 'linear-gradient(90deg, #C799FD 0%, #984BFE 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '1em',
                        padding: '10px 28px',
                        cursor: 'pointer'
                    }}
                >
                    📄 Download TXT
                </button>
            </div>
            
            <div style={{
                width: '100%',
                overflowX: 'auto',
                marginBottom: '18px'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(152,75,254,0.06)',
                    fontSize: '1em'
                }}>
                    <thead>
                        <tr style={{ background: '#f4ebff', color: '#984BFE' }}>
                            <th style={{ padding: '12px', borderRadius: '12px 0 0 0' }}>🏆 Rank</th>
                            <th style={{ padding: '12px' }}>📄 Resume Name</th>
                            <th style={{ padding: '12px' }}>⭐ Score</th>
                            <th style={{ padding: '12px', borderRadius: '0 12px 0 0' }}>💡 Explanation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedResumes.map((resume, idx) => (
                            <tr key={resume.name} style={{ borderBottom: '1px solid #f4ebff' }}>
                                <td style={{ 
                                    padding: '12px', 
                                    fontWeight: 700, 
                                    color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#984BFE', 
                                    textAlign: 'center',
                                    fontSize: '1.1em'
                                }}>
                                    {idx + 1}
                                </td>
                                <td style={{ padding: '12px', color: '#412D6D', fontWeight: 500 }}>{resume.name}</td>
                                <td style={{ 
                                    padding: '12px', 
                                    color: resume.score >= 85 ? '#22c55e' : resume.score >= 75 ? '#f59e0b' : '#ef4444', 
                                    fontWeight: 600, 
                                    textAlign: 'center',
                                    fontSize: '1.1em'
                                }}>
                                    {resume.score}%
                                </td>
                                <td style={{ padding: '12px', color: '#412D6D', fontSize: '0.98em' }}>{resume.explanation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <button
                style={{
                    background: 'linear-gradient(90deg, #984BFE 0%, #C799FD 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '1em',
                    padding: '10px 28px',
                    cursor: 'pointer',
                    marginTop: '18px'
                }}
                onClick={() => navigate('/home')}
            >
                🏠 Back to Home
            </button>
        </div>
    )
}

export default Results