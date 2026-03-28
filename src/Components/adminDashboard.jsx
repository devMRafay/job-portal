import React, { useEffect, useState } from 'react'
import { firestore } from '../config/firebase'
import '../App.css'

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState([])

  const getUserData = async () => {
    var userId = localStorage.getItem('uid')
    var data = []
    await firestore.collection('users').doc(userId).get()
      .then((snap) => { data.push(snap.data()); setAdminData([...data]) })
      .catch((e) => console.log(e))
  }

  useEffect(() => { getUserData() }, [])

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your admin overview.</p>
      </div>

      {adminData.map((val, ind) => (
        <div key={ind} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="profile-card">
            <div className="profile-avatar">
              {val.imageUrl ? <img src={val.imageUrl} alt={val.name} /> : getInitials(val.name)}
            </div>
            <div className="profile-name">{val.name}</div>
            <div className="profile-email">{val.email}</div>
            <span className="profile-badge">⚙ Administrator</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
