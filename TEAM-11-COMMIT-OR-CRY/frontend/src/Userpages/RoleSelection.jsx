import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserRole } from '../redux/userSlice'
import '../style/RoleSelection.css'

function RoleSelection() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [selectedRole, setSelectedRole] = useState('')

    const handleRoleSelect = (role) => {
        setSelectedRole(role)
        // Store the role in Redux state
        dispatch(setUserRole(role))
        
        // Navigate based on role selection
        if (role === 'employee') {
            navigate('/employee-dashboard')
        } else if (role === 'recruiter') {
            navigate('/home')
        }
    }

    return (
        <div className="role-selection-container">
            {/* Animated background elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="role-selection-content">
                <div className="role-header">
                    <div className="role-icon">
                        <svg fill='#984BFE' viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V4C15 1.8 13.2 0 11 0S7 1.8 7 4V5.5L1 7V9L7 7.5V22H9V14H15V22H17V7.5L21 9Z"/>
                        </svg>
                    </div>
                    <h1 className="role-title">Choose Your Role</h1>
                    <p className="role-subtitle">Select how you'll be using ReMatch to get the best experience</p>
                </div>

                <div className="role-cards">
                    <div 
                        className={`role-card ${selectedRole === 'employee' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('employee')}
                    >
                        <div className="role-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3>Employee</h3>
                        <p>Upload your resume and get it analyzed against specific job descriptions</p>
                        <div className="role-features">
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                Single resume analysis
                            </div>
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                AI-powered scoring
                            </div>
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                Improvement suggestions
                            </div>
                        </div>
                        <div className="role-select-btn">
                            Continue as Employee
                        </div>
                    </div>

                    <div 
                        className={`role-card ${selectedRole === 'recruiter' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('recruiter')}
                    >
                        <div className="role-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM16 14C19.3 14 22 15.3 22 18V20H10V18C10 15.3 12.7 14 16 14ZM8 12C9.1 12 10 11.1 10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12ZM8 13C6.3 13 3 13.9 3 15.5V17H9V15.5C9 14.6 8.4 13.8 7.6 13.3C7.1 13.1 7.6 13 8 13Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3>Recruiter</h3>
                        <p>Upload multiple resumes and rank them against job requirements</p>
                        <div className="role-features">
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                Bulk resume analysis
                            </div>
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                Candidate ranking
                            </div>
                            <div className="feature">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                Comparison reports
                            </div>
                        </div>
                        <div className="role-select-btn">
                            Continue as Recruiter
                        </div>
                    </div>
                </div>

                <div className="role-footer">
                    <p className="role-note">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
                        </svg>
                        You can change your role preference anytime from your dashboard
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RoleSelection
