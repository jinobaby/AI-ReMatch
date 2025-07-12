import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/EmployeeDashboard.css'

function EmployeeDashboard() {
    const navigate = useNavigate()
    const [resumeFile, setResumeFile] = useState(null)
    const [jobDescription, setJobDescription] = useState('')
    const [error, setError] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const fileInputRef = useRef(null)
    
    const MAX_SIZE_MB = 5

    const handleFileSelect = (selectedFile) => {
        const file = selectedFile[0]
        
        if (!file) return
        
        // Validate file type
        if (!(file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
            setError('Please upload a PDF or DOCX file.')
            return
        }
        
        // Validate file size
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File size must be less than ${MAX_SIZE_MB}MB.`)
            return
        }
        
        setResumeFile(file)
        setError('')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const removeFile = () => {
        setResumeFile(null)
        setError('')
    }

    const handleJobDescriptionChange = (e) => {
        setJobDescription(e.target.value)
        if (error && e.target.value.trim()) {
            setError('')
        }
    }

    const analyzeResume = async () => {
        // Validation
        if (!resumeFile) {
            setError('Please upload your resume.')
            return
        }
        
        if (!jobDescription.trim()) {
            setError('Please provide a job description.')
            return
        }
        
        if (jobDescription.trim().length < 50) {
            setError('Please provide a more detailed job description (at least 50 characters).')
            return
        }

        setIsAnalyzing(true)
        setError('')

        try {
            // Navigate to results with the data
            navigate('/employee-results', { 
                state: { 
                    resumeFile, 
                    jobDescription: jobDescription.trim() 
                } 
            })
        } catch (error) {
            console.error('Analysis failed:', error)
            setError('Analysis failed. Please try again.')
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="employee-dashboard">
            <div className="employee-content">
                <div className="employee-header">
                    <div className="employee-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1 className="employee-title">Resume Analysis</h1>
                    <p className="employee-subtitle">Upload your resume and job description to get AI-powered insights</p>
                </div>

                <div className="analysis-container">
                    <div className="analysis-grid">
                        {/* Resume Upload Section */}
                        <div className="upload-section">
                            <h3 className="section-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                                </svg>
                                Upload Your Resume
                            </h3>
                            
                            <div 
                                className={`upload-area ${resumeFile ? 'has-file' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => !resumeFile && fileInputRef.current?.click()}
                            >
                                {!resumeFile ? (
                                    <>
                                        <div className="upload-icon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <p className="upload-text">
                                            <strong>Click to upload</strong> or drag and drop your resume
                                        </p>
                                        <p className="upload-hint">PDF or DOCX (max {MAX_SIZE_MB}MB)</p>
                                    </>
                                ) : (
                                    <div className="file-preview">
                                        <div className="file-icon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <div className="file-info">
                                            <p className="file-name">{resumeFile.name}</p>
                                            <p className="file-size">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button 
                                            className="remove-file-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeFile()
                                            }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf,.docx"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>

                        {/* Job Description Section */}
                        <div className="job-section">
                            <h3 className="section-title">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,6L10,16L4,10L5.41,8.59L10,13.17L18.59,4.58L20,6Z" fill="currentColor"/>
                                </svg>
                                Job Description
                            </h3>
                            
                            <div className="job-input-area">
                                <textarea
                                    className={`job-textarea ${jobDescription.trim() ? 'has-content' : ''}`}
                                    placeholder="Paste the job description here... Include requirements, responsibilities, and qualifications for the best analysis."
                                    value={jobDescription}
                                    onChange={handleJobDescriptionChange}
                                    rows={10}
                                />
                                <div className="character-count">
                                    {jobDescription.length} characters
                                    {jobDescription.length < 50 && (
                                        <span className="min-chars"> (minimum 50 required)</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Analyze Button */}
                    <button
                        className={`analyze-btn ${resumeFile && jobDescription.trim().length >= 50 ? 'ready' : 'disabled'}`}
                        onClick={analyzeResume}
                        disabled={!resumeFile || jobDescription.trim().length < 50 || isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="spinner"></div>
                                Analyzing Resume...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" fill="currentColor"/>
                                </svg>
                                Analyze My Resume
                            </>
                        )}
                    </button>
                </div>

                {/* Info Cards */}
                <div className="info-cards">
                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h4>AI-Powered Analysis</h4>
                        <p>Get detailed insights on how well your resume matches the job requirements</p>
                    </div>
                    
                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h4>Match Score</h4>
                        <p>Receive a percentage score showing how well you fit the position</p>
                    </div>
                    
                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h4>Improvement Tips</h4>
                        <p>Get specific suggestions to enhance your resume for better job matches</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard
