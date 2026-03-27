import React, { useEffect, useState } from 'react';
import { firestore } from '../config/firebase';

const AdminPanel = () => {
  const [allAppliedCandidates, setAllAppliedCandidates] = useState([]);

  // Function to fetch all applied candidates from Firestore
  
    const fetchingAppliedCandidate = async () => {
      const allCandidates = [];
      await firestore.collection('Applied-Jobs').where('status', '==', 'pending').get()
      .then((snap)=>{
        snap.forEach((doc) => {
          console.log(doc.data())

          allCandidates.push(doc.data());
        });
        setAllAppliedCandidates(allCandidates);
      
      }).catch((e)=>{
        alert('Error fetching candidates:', e);
        })
    };
  useEffect(()=>{    
    fetchingAppliedCandidate();
  },[])
  
  
  // Handle acceptance of a candidate
  const handleAccept = async (e) => {
    console.log(e.userId)
    try {
      const userId = e.userId;
      await firestore.collection('Applied-Jobs').doc(userId).update({
        status: 'Accepted',
        jobVacant: 'false',
      });
      fetchingAppliedCandidate(); // Refresh the list after updating
    } catch (err) {
      alert('Error accepting candidate:', err);
    }
  };
  
  // Handle rejection of a candidate
  const handleReject = async (e) => {
    console.log(e.userId)
    try {
      const userId = e.userId;
      await firestore.collection('Applied-Jobs').doc(userId).delete();
      const msg = 'Rejected successfully!';
      alert(msg)
      fetchingAppliedCandidate(); // Refresh the list after updating
    }catch(err){
      alert('Error rejecting candidate:', err);
    }
  };

// };
  return (
    <div className="min-w-full min-h-screen flex flex-col items-center font-lato">
      <div className="flex justify-between items-center w-full p-6 bg-blue-400 text-white">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-xl">Manage Applied Candidates</p>
      </div>

      <div className="w-full h-screen p-6 bg-slate-50">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Applied Candidates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAppliedCandidates.length === 0 ? (
            <p>No candidates have applied yet.</p>
          ) : (
            allAppliedCandidates.map((val, ind) => (
              <div key={ind} className="card  gap-3 m-6 p-4  text-black w-80 h-auto bg-slate-50 hover:border-2 border-slate-50 rounded-md">
                <p className="text-xl font-bold text-black ">{val.userName}</p>
                <p>Email: {val.userEmail}</p>
                <p>Job Title: {val.jobTitle}</p>
                <p>Description: {val.jobDescription}</p>
                
                <div className="flex justify-center items-center gap-2 mt-4">
                <p>Status: {val.status}</p>
                  <button
                    className="bg-red-500 hover:bg-red-600 rounded-md text-white px-4 py-2"
                    onClick={() => handleReject(val)}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 rounded-md text-white px-4 py-2"
                    onClick={() => handleAccept(val)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
