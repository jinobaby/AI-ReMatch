import React, { useState, useEffect } from 'react'
import '../style/AdminLogin.css'
import { userLoginApi } from '../services/userApi'
import { useDispatch } from 'react-redux'
import { userLoginData } from '../redux/userSlice'
import { useNavigate, Link } from 'react-router-dom'

function UserLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    // Form validation
    useEffect(() => {
        const isValid = loginData.email.includes('@') && loginData.password.length > 0
        setIsFormValid(isValid)
    }, [loginData])

    function HandleData(e) {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (error) setError('')
    }

    function togglePasswordVisibility() {
        setShowPassword(!showPassword)
    }

    async function HandleLoginSubmit() {
        if (!isFormValid) {
            setError('Please fill all fields correctly')
            return
        }

        setIsLoading(true)
        setError('')
        
        try {
            const response = await userLoginApi(loginData)
            if (response?.data?.Token) {
                dispatch(userLoginData(response.data))
                navigate('/role-selection')
            } else {
                setError(response?.data?.message || 'Login failed. Please try again.')
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='login-main'>
            {/* Animated background elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <section className='main-login-form'>
                {/* Header with existing logo preserved */}
                <div className="login-header">
                    <div className='login-signup-header' style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <svg fill='#984BFE' role="img" viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                            <title>Remix</title>
                            <path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z" />
                        </svg>
                        <div style={{ fontSize: '1.1em', color: '#C799FD', marginTop: '4px' }}>Welcome Back</div>
                    </div>
                    <p className="login-subtitle">Sign in to access your ReMatch dashboard.</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="error-message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Email input */}
                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                        <input
                            className={`login-input ${loginData.email && loginData.email.includes('@') ? 'valid' : ''}`}
                            type="email"
                            placeholder='Enter your email'
                            name='email'
                            onChange={HandleData}
                            value={loginData.email}
                        />
                        <div className="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Password input */}
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <input
                            className={`login-input ${loginData.password.length > 0 ? 'valid' : ''}`}
                            type={showPassword ? "text" : "password"}
                            placeholder='Enter your password'
                            name='password'
                            onChange={HandleData}
                            value={loginData.password}
                        />
                        <button 
                            type="button" 
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 7C9.24 7 7 9.24 7 12S9.24 17 12 17 17 14.76 17 12 14.76 7 12 7ZM12 4.5C17 4.5 21.27 7.61 23 12C21.27 16.39 17 19.5 12 19.5S2.73 16.39 1 12C2.73 7.61 7 4.5 12 4.5ZM12 9C13.66 9 15 10.34 15 12S13.66 15 12 15 9 13.66 9 12 10.34 9 12 9Z" fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 7C9.24 7 7 9.24 7 12C7 13.08 7.37 14.05 8 14.82L9.17 13.65C9.06 13.45 9 13.23 9 13C9 11.34 10.34 10 12 10C12.23 10 12.45 10.06 12.65 10.17L13.82 9C13.1 8.37 12.13 8 12 8V7M2.01 3.87L4.14 6L6.47 8.33C4.82 9.9 3.5 11.9 3 14C4.73 18.39 8 21.5 12 21.5C13.55 21.5 15.03 21.2 16.38 20.66L17.59 21.87L18.73 20.73L3.27 5.27L2.01 3.87M12 19.5C8.25 19.5 5.18 17.12 4.11 14C4.22 13.7 4.39 13.39 4.6 13.08L5.06 12.5C5.16 12.5 5.25 12.5 5.35 12.5C5.78 12.5 6.15 12.81 6.35 13.2L7.5 12.05C7.18 11.46 6.73 10.96 6.17 10.6L7.97 8.8C9.07 8.29 10.5 8 12 8C15.75 8 18.82 10.38 19.89 14C19.5 15.17 18.77 16.2 17.78 17L19.73 18.95C20.82 17.58 21.5 15.85 21.5 14C19.77 9.61 16.5 6.5 12 6.5C10.85 6.5 9.76 6.76 8.77 7.22L6.47 4.93C8.41 3.75 10.67 3 13 3C18 3 22.27 6.11 24 10.5C23.27 12.84 21.77 14.81 19.73 16.27L22.13 18.67L20.99 19.81L2.01 3.87Z" fill="currentColor"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Login button */}
                <button 
                    type='button' 
                    className={`login-btn ${isFormValid ? 'valid' : 'disabled'}`}
                    onClick={HandleLoginSubmit}
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner"></div>
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>

                {/* Signup link */}
                <div className="login-footer">
                    <p style={{ textAlign: 'center', margin: 0, color: '#718096', fontSize: '14px' }}>
                        Don't have an account? {' '}
                        <Link to="/Signup" style={{ color: '#984BFE', textDecoration: 'none', fontWeight: '500' }}>
                            Sign up here
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    )
}

export default UserLogin