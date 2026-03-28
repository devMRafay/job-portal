import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firestore } from '../config/firebase'
import '../App.css'

const UserView = () => {
  const [JobsData, setJobsData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()
  const userId = localStorage.getItem('uid')
  const userName = localStorage.getItem('name')
  const userEmail = localStorage.getItem('email')
  const userImage = localStorage.getItem('image') || ''

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const fetchJobDataAtUserPanel = async () => {
      setLoading(true)
      await firestore.collection('AllJobs').where('jobVacant', '==', 'true').get()
        .then((snap) => {
          const allJobsData = []
          snap.forEach((doc) => allJobsData.push(doc.data()))
          setJobsData(allJobsData)
        })
      setLoading(false)
    }
    fetchJobDataAtUserPanel()
  }, [])

  const handleLogOut = () => { localStorage.clear(); nav('/login') }
  const handleCategoryClick = (category) => setSelectedCategory(category)

  const filteredJobs = selectedCategory === 'All'
    ? JobsData
    : JobsData.filter(job => job.selectedCategory === selectedCategory)

  const handleAppliedForJob = async (data) => {
    const userDataForAppliedData = {
      userId, userName, userEmail,
      jobTitle: data.jobTitle, jobDescription: data.jobDescription,
      jobId: data.jobId, status: 'pending'
    }
    await firestore.collection('Applied-Jobs').doc(userId).set(userDataForAppliedData)
      .then(() => alert('Applied successfully!'))
      .catch((e) => alert(e))
  }

  const categories = ['All', 'Frontend Developer', 'Backend Developer', 'Ui/Ux Designer', 'Devops']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-3)' }}>
      {/* Navbar */}
      <nav className="user-navbar">
        <div className="user-navbar-brand">
          <span>💼 JobPortal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="admin-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
            {userImage ? <img src={userImage} alt={userName} /> : getInitials(userName || '')}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginRight: 8 }}>{userName}</span>
        </div>
        <div className="user-nav-actions">
          <Link to="/appliedJobs" className="btn-nav-link">My Applications</Link>
          <button className="btn-logout" onClick={handleLogOut}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'var(--primary)', padding: '36px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.3px' }}>
          Find Your Dream Job
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
          Browse {JobsData.length} open positions across categories
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button key={cat} className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div> Loading jobs…</div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔍</div><p>No jobs found in this category</p></div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((val, ind) => (
            <div key={ind} className="job-card">
              <span className="job-category-badge">{val.selectedCategory}</span>
              <div className="job-title">{val.jobTitle}</div>
              <div className="job-desc">{val.jobDescription}</div>
              <div className="job-meta">
                <div className="job-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <strong>Exp:</strong> {val.jobExperience}
                </div>
              </div>
              <div className="job-card-footer">
                <div className="job-salary">Rs {val.jobSalaryOffer}</div>
                <button className="btn-apply" onClick={() => handleAppliedForJob(val)}>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserView
