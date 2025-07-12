import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Loading() {
    const location = useLocation()
    const navigate = useNavigate()
    const { files, jdText } = location.state || {}

    useEffect(() => {
        async function analyzeResumes() {
            if (!files || !jdText) {
                navigate('/home')
                return
            }
            
            try {
                const formData = new FormData()
                files.forEach(file => formData.append('resumes', file))
                formData.append('jobDescription', jdText)
                
                const persistLogindata = localStorage.getItem('persist:logindata')
                const loginData = persistLogindata ? JSON.parse(persistLogindata) : {}
                const userInfo = loginData.UserLogin ? JSON.parse(loginData.UserLogin).UserLoginStore : null
                const token = userInfo?.Token
                
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/Resume/rank-resumes`,
                    formData,
                    { 
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                            ...(token && { 'Authorization': token })
                        } 
                    }
                )
                
                if (response.data.success) {
                    navigate('/results', { 
                        state: { 
                            rankedResumes: response.data.data,
                            processingSummary: response.data.processingSummary
                        } 
                    })
                } else {
                    throw new Error(response.data.message || 'Failed to analyze resumes')
                }
                
            } catch (error) {
                console.error('Error analyzing resumes:', error)
                const errorMessage = error.response?.data?.message || 'Failed to analyze resumes. Please try again.'
                navigate('/job-description', { 
                    state: { files, jdText, error: errorMessage } 
                })
            }
        }
        
        analyzeResumes()
    }, [])

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'var(--gradient-light)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-purple)',
                padding: '48px 64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
                maxWidth: '90vw',
                maxHeight: '80vh',
                margin: 'auto',
            }}>
                <svg width="64" height="64" viewBox="0 0 50 50" style={{ marginBottom: 24 }}>
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="var(--color-purple)"
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
                <h2 style={{
                    color: 'var(--color-purple-dark)',
                    fontWeight: 700,
                    fontSize: '2em',
                    textAlign: 'center',
                    marginBottom: '12px',
                }}>
                    Analyzing Your Resumes...
                </h2>
                <p style={{
                    color: 'var(--color-purple-muted)',
                    textAlign: 'center',
                    fontSize: '1.08em',
                    marginBottom: '8px',
                }}>
                    Processing {files?.length || 0} resume files and matching against job description...
                </p>
                <div style={{
                    marginTop: '16px',
                    padding: '12px 20px',
                    background: 'var(--color-background-light)',
                    borderRadius: '12px',
                    fontSize: '0.9em',
                    color: 'var(--color-purple-muted)'
                }}>
                    ✨ Extracting text • 🔍 Analyzing content • 📊 Calculating scores
                </div>
            </div>
        </div>
    )
}

export default Loading