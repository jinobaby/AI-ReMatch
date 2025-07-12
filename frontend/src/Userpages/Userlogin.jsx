import React, { useState } from 'react'
import { userLoginApi } from '../services/userApi'
import { useDispatch } from 'react-redux'
import { userLoginData } from '../redux/userSlice'
import { useNavigate, Link } from 'react-router-dom'

function UserLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    function HandleData(e) {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
    }

    async function HandleLoginSubmit() {
        const response = await userLoginApi(loginData)
        if (response?.data?.Token) {
            dispatch(userLoginData(response.data))
            navigate('/home')
        } else {
            setError(response?.data?.message || 'Login failed. Please try again.')
        }
    }

    return (
        <div className='login-main'>
            <section className='main-login-form'>
                <div className='login-signup-header'  style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <svg fill='#984BFE' role="img" viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                    <title>Remix</title>
                    <path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z" />
                  </svg>
                  <div style={{ fontSize: '1.1em', color: '#C799FD', marginTop: '4px' }}>Welcome Back</div>
                </div>
                {error && <div style={{ color: 'red', marginBottom: '8px', textAlign: 'center' }}>{error}</div>}
                <label htmlFor="email">Email</label>
                <input
                    className='login-input'
                    type="email"
                    placeholder='Enter your email'
                    name='email'
                    onChange={HandleData}
                    aria-label="Email"
                />
                <label htmlFor="password">Password</label>
                <input
                    className='login-input'
                    type="password"
                    placeholder='Enter your password'
                    name='password'
                    onChange={HandleData}
                    aria-label="Password"
                />
                <button type='button' onClick={HandleLoginSubmit} className='login-btn'>Login</button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.95em' }}>
                    Don't have an account? <Link to="/Signup" style={{ color: '#984BFE', textDecoration: 'underline' }}>Sign up</Link>
                </div>
            </section>
        </div>
    )
}

export default UserLogin