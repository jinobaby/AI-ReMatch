import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function JobDescription() {
    const [jdText, setJdText] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const { files } = location.state || {}

    const handleChange = (e) => setJdText(e.target.value)

    // Submit resumes + JD to backend
    const handleAnalyze = async () => {
        if (jdText.trim().length === 0 || !files || files.length === 0) return
        setError('')
        // Navigate to loading page and pass files + JD
        navigate('/loading', { state: { files, jdText } })
    }

    return (
        <div style={{
            width: '100%',
            background: 'rgba(152,75,254,0.08)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(28,21,38,0.12)',
            padding: '40px 32px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h2 style={{
                color: '#412D6D',
                fontWeight: 700,
                fontSize: '2em',
                textAlign: 'center',
                marginBottom: '12px'
            }}>
                Paste The Job Description
            </h2>
            <p style={{
                color: '#6c5a99',
                textAlign: 'center',
                marginBottom: '24px',
                fontSize: '1.05em'
            }}>
                Paste the job description from the job posting. We'll match your resumes against it to calculate your score.
            </p>
            {/* Uploaded resumes list */}
            <div style={{
                width: '100%',
                marginBottom: '18px',
                background: '#f4ebff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(152,75,254,0.06)',
                padding: '18px 16px'
            }}>
                <strong style={{ color: '#984BFE', fontSize: '1.08em' }}>Uploaded Resumes:</strong>
                {files && files.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        marginTop: '10px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {files.map((file, idx) => (
                            <li key={idx} style={{
                                background: '#fff',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                color: '#412D6D',
                                fontWeight: 500,
                                boxShadow: '0 1px 4px rgba(152,75,254,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <svg width="18" height="18" fill="none" stroke="#984BFE" strokeWidth="2" style={{ marginRight: 4 }}>
                                    <rect x="3" y="3" width="12" height="12" rx="3" />
                                    <path d="M6 7h6M6 11h4" />
                                </svg>
                                <span>{file.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span style={{ color: '#C799FD', fontSize: '0.98em' }}>No resume files selected.</span>
                )}
            </div>
            {/* JD textarea */}
            <div style={{
                background: '#f4ebff',
                border: '2px dashed #984BFE',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <textarea
                    value={jdText}
                    onChange={handleChange}
                    placeholder="Paste your job description here..."
                    style={{
                        width: '100%',
                        minHeight: '160px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1.1em',
                        color: '#412D6D',
                        resize: 'vertical',
                        outline: 'none'
                    }}
                />
                <span style={{
                    position: 'absolute',
                    top: '18px',
                    right: '18px',
                    color: '#984BFE',
                    fontSize: '1.3em'
                }}>
                    <svg width="24" height="24" fill="none" stroke="#984BFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="4" />
                        <path d="M8 10h8M8 14h6" />
                    </svg>
                </span>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '18px',
                justifyContent: 'center',
                width: '100%'
            }}>
                <button
                    onClick={handleAnalyze}
                    disabled={jdText.trim().length === 0}
                    style={{
                        background: 'linear-gradient(90deg, #984BFE 0%, #C799FD 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '1em',
                        padding: '10px 28px',
                        cursor: jdText.trim().length === 0 ? 'not-allowed' : 'pointer',
                        opacity: jdText.trim().length === 0 ? 0.6 : 1,
                        transition: 'background 0.2s'
                    }}
                >
                    Analyze Resume
                </button>
            </div>
            {/* JD Preview */}
            {jdText && (
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '18px',
                    marginTop: '12px',
                    color: '#412D6D',
                    fontSize: '1em',
                    boxShadow: '0 2px 8px rgba(152,75,254,0.06)',
                    width: '100%',
                    textAlign: 'left'
                }}>
                    <strong style={{ color: '#984BFE' }}>Job Description Preview:</strong>
                    <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{jdText}</div>
                </div>
            )}
        </div>
    )
}

export default JobDescription