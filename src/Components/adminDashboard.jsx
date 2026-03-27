import React, { useEffect, useState } from 'react';
import { firestore } from '../config/firebase';

const AdminDashboard = () => {  
  const [adminData, setAdminData] = useState([]); 

  const getUserData = async () => {
    var userId = localStorage.getItem("uid");
    var data = [];
    
    await firestore.collection('users').doc(userId).get()
      .then((snap) => {
        data.push(snap.data());
        setAdminData(...[data]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(()=>{
    getUserData();
  },[])

  // const handleAdminData = () => {
  // };

  return (
    <div className="flex flex-col justify-center items-center min-w-full min-h-screen">
      {/* <div className='{font-lato text-center h-screen overflow-auto touch-pan-y'> */}

      {adminData.map((val, ind) => (
        <div key={ind} className="flex flex-col justify-center items-center h-screen overflow-auto touch-pan-y">
          <h1 className="px-3 py-6 text-4xl font-playfair font-bold">{val.title}</h1>
          <img className="rounded-full border w-72" src={val.imageUrl} alt="" />
          <p className="px-6 py-3">{val.name}</p>
          <p className="px-6 py-3">{val.email}</p>
        </div>
      ))}
      {/* </div> */}
    </div>
  );
};

export default AdminDashboard;