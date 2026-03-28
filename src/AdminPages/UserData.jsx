import React, { useEffect, useState } from 'react'
import { firestore } from '../config/firebase'
import '../App.css'

const AdminPanel = () => {
  const [allAppliedCandidates, setAllAppliedCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchingAppliedCandidate = async () => {
    setLoading(true)
    const allCandidates = []
    await firestore.collection('Applied-Jobs').where('status', '==', 'pending').get()
      .then((snap) => {
        snap.forEach((doc) => allCandidates.push(doc.data()))
        setAllAppliedCandidates(allCandidates)
      }).catch((e) => alert('Error fetching candidates: ' + e))
    setLoading(false)
  }

  useEffect(() => { fetchingAppliedCandidate() }, [])

  const handleAccept = async (e) => {
    try {
      await firestore.collection('Applied-Jobs').doc(e.userId).update({ status: 'Accepted', jobVacant: 'false' })
      fetchingAppliedCandidate()
    } catch (err) { alert('Error accepting candidate: ' + err) }
  }

  const handleReject = async (e) => {
    try {
      await firestore.collection('Applied-Jobs').doc(e.userId).delete()
      fetchingAppliedCandidate()
    } catch (err) { alert('Error rejecting candidate: ' + err) }
  }

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Review and manage candidate applications</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div> Loading applications…</div>
      ) : allAppliedCandidates.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📬</div><p>No pending applications</p></div>
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{allAppliedCandidates.length} pending application{allAppliedCandidates.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="candidates-grid">
            {allAppliedCandidates.map((val, ind) => (
              <div key={ind} className="candidate-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div className="admin-avatar" style={{ width: 42, height: 42, fontSize: 14, flexShrink: 0 }}>
                    {getInitials(val.userName)}
                  </div>
                  <div>
                    <div className="candidate-name">{val.userName}</div>
                    <div className="candidate-info">{val.userEmail}</div>
                  </div>
                </div>
                <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
                <div className="candidate-info"><strong style={{ color: 'var(--text-1)' }}>Role:</strong> {val.jobTitle}</div>
                <div className="candidate-info" style={{ marginTop: 4 }}><strong style={{ color: 'var(--text-1)' }}>Description:</strong> {val.jobDescription}</div>
                <div className="candidate-actions">
                  <span className="badge badge-pending">Pending</span>
                  <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                    <button className="btn-reject" onClick={() => handleReject(val)}>Reject</button>
                    <button className="btn-accept" onClick={() => handleAccept(val)}>Accept</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminPanel
