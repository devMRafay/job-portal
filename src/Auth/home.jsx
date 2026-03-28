import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, firestore, storage } from '../config/firebase'
import '../App.css'

function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const imageUpload = async (e) => {
    var storageRef = storage.ref('image').child(e.target.files[0].name)
    await storageRef.put(e.target.files[0]).then((snapshot) => {
      storageRef.getDownloadURL().then((url) => setLink(url)).catch((e) => alert(e))
    })
  }

  const signUp = async () => {
    if (!name || !email || !password) return alert('Please fill all fields')
    setLoading(true)
    await auth.createUserWithEmailAndPassword(email, password)
      .then(async (user) => {
        var userData = { email, password, name, userUid: user.user.uid, userType: 'User', imageUrl: link }
        await firestore.collection('users').doc(user.user.uid).set(userData)
          .then(() => nav('/login'))
          .catch((e) => alert(e))
      }).catch((e) => { alert(e.message); setLoading(false) })
  }

  return (
    <div className="auth-layout">
      <div className="auth-panel-left">
        <div style={{ fontSize: 36, marginBottom: 8 }}>💼</div>
        <h1>Welcome Back!</h1>
        <p>Already have an account? Sign in to explore thousands of job opportunities.</p>
        <Link to="/login" className="btn-outline">Sign In</Link>
      </div>

      <div className="auth-panel-right">
        <div className="auth-logo-icon">💼</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us and find your dream job today</p>

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Profile photo <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
            <input className="form-input-file" type="file" accept="image/*" onChange={(e) => imageUpload(e)} />
          </div>
          <button className="btn-primary" onClick={signUp} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Home
