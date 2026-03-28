import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firestore } from '../config/firebase'
import '../App.css'

const AppliedJobs = () => {
  const userId = localStorage.getItem('uid')
  const userName = localStorage.getItem('name') || ''
  const userImage = localStorage.getItem('image') || ''
  const [acceptedAppliedJobs, setAcceptedAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const fetchAcceptedAppliedJobs = async () => {
      setLoading(true)
      const allAcceptedJobsData = []
      await firestore.collection('Applied-Jobs').where('userId', '==', userId).where('status', '==', 'Accepted').get()
        .then((snap) => {
          snap.forEach((doc) => allAcceptedJobsData.push(doc.data()))
          setAcceptedAppliedJobs(allAcceptedJobsData)
        }).catch((e) => alert('Error fetching data: ' + e))
      setLoading(false)
    }
    fetchAcceptedAppliedJobs()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-3)' }}>
      {/* Navbar */}
      <nav className="user-navbar">
        <div className="user-navbar-brand">💼 JobPortal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="admin-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
            {userImage ? <img src={userImage} alt={userName} /> : getInitials(userName)}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginRight: 8 }}>{userName}</span>
        </div>
        <div className="user-nav-actions">
          <Link to="/userView" className="btn-nav-link">Browse Jobs</Link>
          <button className="btn-logout" onClick={() => { localStorage.clear(); nav('/login') }}>Logout</button>
        </div>
      </nav>

      {/* Header */}
      <div className="applied-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading"><div className="spinner"></div> Loading applications…</div>
      ) : acceptedAppliedJobs.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-icon">📭</div>
          <p style={{ fontSize: 15, marginBottom: 8, color: 'var(--text-2)' }}>No accepted applications yet</p>
          <p>Your accepted job applications will appear here once an admin reviews them.</p>
          <Link to="/userView" style={{ display: 'inline-flex', alignItems: 'center', marginTop: 20, height: 40, padding: '0 20px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="applied-grid">
          {acceptedAppliedJobs.map((val, ind) => (
            <div key={ind} className="applied-card">
              <span className="badge badge-accepted">✓ Accepted</span>
              <div className="applied-card-title">{val.jobTitle}</div>
              <div className="applied-card-desc">{val.jobDescription}</div>
              <div className="applied-card-id">Job ID: {val.jobId}</div>
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
                🎉 Congratulations! Your application has been accepted.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppliedJobs
