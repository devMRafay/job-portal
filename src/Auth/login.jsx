import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, firestore } from '../config/firebase'
import '../App.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const LoginUser = async () => {
    if (!email || !password) return alert('Please fill all fields')
    setLoading(true)
    await auth.signInWithEmailAndPassword(email, password)
      .then(async (user) => {
        await firestore.collection('users').doc(user.user.uid).get()
          .then((snap) => {
            localStorage.setItem('uid', user.user.uid)
            localStorage.setItem('email', email)
            localStorage.setItem('name', snap.data()['name'])
            localStorage.setItem('image', snap.data()['imageUrl'])
            var userType = snap.data()['userType']
            userType === 'Admin' ? nav('/AdminDashboard') : nav('/userView')
          }).catch((e) => { alert('Error fetching data! ' + e); setLoading(false) })
      }).catch((e) => { alert('Invalid credentials! ' + e); setLoading(false) })
  }

  return (
    <div className="auth-layout">
      <div className="auth-panel-right" style={{ order: -1 }}>
        <div className="auth-logo-icon">💼</div>
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back! Enter your credentials to continue</p>

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && LoginUser()} />
          </div>
          <button className="btn-primary" onClick={LoginUser} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <div className="auth-footer">Don't have an account? <Link to="/">Create one</Link></div>
        </div>
      </div>

      <div className="auth-panel-left">
        <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details and start your journey with thousands of job opportunities.</p>
        <Link to="/" className="btn-outline">Create Account</Link>
      </div>
    </div>
  )
}

export default Login
