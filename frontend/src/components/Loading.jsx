import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Loading() {
    const location = useLocation()
    const navigate = useNavigate()
    const { files, jdText } = location.state || {}

    useEffect(() => {
        async function analyzeResumes() {
            if (!files || !jdText) return
            try {
                const formData = new FormData()
                files.forEach(file => formData.append('resumes', file))
                formData.append('jobDescription', jdText)
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/rank-resumes`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                )
                navigate('/results', { state: { rankedResumes: response.data } })
            } catch (error) {
                console.error(error)
                navigate('/job-description', { state: { files, jdText, error: 'Failed to analyze resumes. Please try again.' } })
            }
        }
        analyzeResumes()
        // eslint-disable-next-line
    }, [])

    return (
        <div style={{ background: "red", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #F4EBFF 0%, #C799FD 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: 0,
                    padding: 0,
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px rgba(152,75,254,0.12)',
                        padding: '48px 64px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 1,
                        maxWidth: '90vw',
                        maxHeight: '80vh',
                        margin: 'auto',
                    }}
                >
                    <svg width="64" height="64" viewBox="0 0 50 50" style={{ marginBottom: 24 }}>
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            stroke="#984BFE"
                            strokeWidth="6"
                            strokeDasharray="31.4 31.4"
                            strokeDashoffset="0"
                        >
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 25 25"
                                to="360 25 25"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                    <h2
                        style={{
                            color: '#412D6D',
                            fontWeight: 700,
                            fontSize: '2em',
                            textAlign: 'center',
                            marginBottom: '12px',
                        }}
                    >
                        Analyzing Your Resumes...
                    </h2>
                    <p
                        style={{
                            color: '#6c5a99',
                            textAlign: 'center',
                            fontSize: '1.08em',
                            marginBottom: '8px',
                        }}
                    >
                        Please wait while we match and rank your resumes against the job description.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Loading