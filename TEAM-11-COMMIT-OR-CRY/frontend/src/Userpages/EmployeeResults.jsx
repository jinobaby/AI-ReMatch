import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserRequest } from '../axios/AxiosCreate'
import '../style/EmployeeResults.css'

function EmployeeResults() {
    const location = useLocation()
    const navigate = useNavigate()
    const [analysisResults, setAnalysisResults] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const { resumeFile, jobDescription } = location.state || {}

    useEffect(() => {
        if (!resumeFile || !jobDescription) {
            navigate('/employee-dashboard')
            return
        }

        const performAnalysis = async () => {
            setIsLoading(true)
            setError('')

            try {
                // Create FormData for file upload
                const formData = new FormData()
                formData.append('resume', resumeFile)
                formData.append('jobDescription', jobDescription)

                console.log('🤖 Starting real AI analysis for employee...')

                // Call the real API endpoint
                const response = await UserRequest.post('/resume/analyze-single-resume', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })

                if (response.data.success) {
                    console.log('✅ AI analysis completed:', response.data.data)
                    setAnalysisResults(response.data.data)
                } else {
                    throw new Error(response.data.message || 'Analysis failed')
                }

            } catch (error) {
                console.error('❌ Analysis failed:', error)
                
                let errorMessage = 'Failed to analyze resume. Please try again.'
                
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message
                } else if (error.message) {
                    errorMessage = error.message
                }
                
                setError(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }

        performAnalysis()
    }, [resumeFile, jobDescription, navigate])

    const getScoreColor = (score) => {
        if (score >= 85) return '#10b981'
        if (score >= 70) return '#f59e0b'
        return '#ef4444'
    }

    const getScoreLabel = (score) => {
        if (score >= 85) return 'Excellent'
        if (score >= 70) return 'Good'
        return 'Needs Improvement'
    }

    const goBackToDashboard = () => {
        navigate('/employee-dashboard')
    }

    if (isLoading) {
        return (
            <div className="employee-results loading-state">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h2>Analyzing Your Resume</h2>
                    <p>Our AI is comparing your resume with the job requirements...</p>
                    <div className="loading-steps">
                        <div className="step active">
                            <div className="step-icon">✓</div>
                            Processing resume content
                        </div>
                        <div className="step active">
                            <div className="step-icon">✓</div>
                            Analyzing job requirements
                        </div>
                        <div className="step">
                            <div className="step-icon">⏳</div>
                            Generating insights
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="employee-results error-state">
                <div className="error-content">
                    <div className="error-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                        </svg>
                    </div>
                    <h2>Analysis Failed</h2>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={goBackToDashboard}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="employee-results">
            <div className="results-content">
                {/* Header */}
                <div className="results-header">
                    <button className="back-btn" onClick={goBackToDashboard}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="results-title">Resume Analysis Results</h1>
                    <p className="results-subtitle">Here's how your resume matches the job requirements</p>
                </div>

                {/* Overall Score */}
                <div className="score-section">
                    <div className="score-card">
                        <div className="score-visual">
                            <div
                                className="score-circle"
                                style={{
                                    background: `conic-gradient(${getScoreColor(analysisResults.overallScore)} ${analysisResults.overallScore * 3.6}deg, #e5e7eb 0deg)`
                                }}
                            >
                                <div className="score-inner">
                                    <span className="score-number">{analysisResults.overallScore}%</span>
                                    <span className="score-label">{getScoreLabel(analysisResults.overallScore)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="score-info">
                            <h3>Overall Match Score</h3>
                            <p>Your resume shows a {getScoreLabel(analysisResults.overallScore).toLowerCase()} match with the job requirements.</p>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="categories-section">
                    <h3 className="section-title">Detailed Breakdown</h3>
                    <div className="categories-grid">
                        {Object.entries(analysisResults.categories).map(([category, score]) => (
                            <div key={category} className="category-card">
                                <div className="category-header">
                                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                    <span className="category-score" style={{ color: getScoreColor(score) }}>
                                        {score}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${score}%`,
                                            backgroundColor: getScoreColor(score)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Analysis */}
                <div className="skills-section">
                    <div className="skills-grid">
                        <div className="skills-card matched">
                            <h3 className="skills-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
                                </svg>
                                Matched Skills
                            </h3>
                            <div className="skills-list">
                                {analysisResults.matchedSkills.map((skill, index) => (
                                    <span key={index} className="skill-tag matched">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="skills-card missing">
                            <h3 className="skills-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                </svg>
                                Missing Skills
                            </h3>
                            <div className="skills-list">
                                {analysisResults.missingSkills.map((skill, index) => (
                                    <span key={index} className="skill-tag missing">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="insights-section">
                    <div className="insights-grid">
                        <div className="insight-card strengths">
                            <h3 className="insight-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" fill="currentColor" />
                                </svg>
                                Your Strengths
                            </h3>
                            <ul className="insight-list">
                                {analysisResults.strengths.map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="insight-card improvements">
                            <h3 className="insight-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="currentColor" />
                                </svg>
                                Suggested Improvements
                            </h3>
                            <ul className="insight-list">
                                {analysisResults.improvements.map((improvement, index) => (
                                    <li key={index}>{improvement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="actions-section">
                    <button className="action-btn primary" onClick={goBackToDashboard}>
                        Analyze Another Resume
                    </button>
                    <button className="action-btn secondary" onClick={() => window.print()}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" fill="currentColor" />
                        </svg>
                        Print Results
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeResults
