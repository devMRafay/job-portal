import React, { useEffect, useState } from 'react'
import { db, firestore } from '../config/firebase'
import '../App.css'

const Items = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [jobSalaryOffer, setJobSalaryOffer] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Frontend Developer')
  const [jobList, setJobList] = useState([])
  const [loading, setLoading] = useState(true)

  const handleAddJob = async () => {
    if (!jobTitle || !jobDescription || !jobExperience || !jobSalaryOffer) return alert('Please fill all fields')
    const jobKey = db.ref('jobkey').push().key
    const jobData = { jobTitle, jobDescription, jobExperience, jobSalaryOffer, selectedCategory, jobId: jobKey, jobVacant: 'true' }
    await firestore.collection('AllJobs').doc(jobKey).set(jobData)
      .then(() => {
        setJobList([...jobList, jobData])
        setJobTitle(''); setJobDescription(''); setJobExperience(''); setJobSalaryOffer('')
      }).catch((e) => console.log('Error adding job:', e))
  }

  useEffect(() => {
    const fetchingAllJobs = async () => {
      setLoading(true)
      await firestore.collection('AllJobs').where('jobVacant', '==', 'true').get()
        .then((snap) => {
          const allJobs = []
          snap.forEach((doc) => allJobs.push(doc.data()))
          setJobList(allJobs)
        }).catch((e) => console.log('Error fetching jobs:', e))
      setLoading(false)
    }
    fetchingAllJobs()
  }, [])

  const handleDelete = async (val) => {
    await firestore.collection('AllJobs').doc(val.jobId).delete()
      .then(() => setJobList(jobList.filter(j => j.jobId !== val.jobId)))
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Manage Jobs</h1>
        <p className="page-subtitle">Post new positions and manage existing listings</p>
      </div>

      {/* Add Job Form */}
      <div className="form-card">
        <div className="form-card-title">Post a New Job</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Job title</label>
            <input className="form-input" type="text" placeholder="e.g. Senior Frontend Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>Ui/Ux Designer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Devops</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Experience required</label>
            <input className="form-input" type="text" placeholder="e.g. 2+ years" value={jobExperience} onChange={(e) => setJobExperience(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Salary package</label>
            <input className="form-input" type="text" placeholder="e.g. 80,000 / year" value={jobSalaryOffer} onChange={(e) => setJobSalaryOffer(e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label className="form-label">Job description</label>
            <input className="form-input" type="text" placeholder="Describe the role and responsibilities…" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn-add" onClick={handleAddJob}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post Job
          </button>
        </div>
      </div>

      {/* Job List Table */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Active Listings</span>
          <span className="table-count">{jobList.length} jobs</span>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner"></div> Loading jobs…</div>
        ) : jobList.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><p>No jobs posted yet</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobList.map((val, ind) => (
                  <tr key={ind}>
                    <td style={{ fontWeight: 500 }}>{val.jobTitle}</td>
                    <td><span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{val.selectedCategory}</span></td>
                    <td className="td-muted">{val.jobExperience}</td>
                    <td className="td-muted">{val.jobSalaryOffer}</td>
                    <td className="td-muted" style={{ maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val.jobDescription}</td>
                    <td><button className="btn-delete" onClick={() => handleDelete(val)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Items
