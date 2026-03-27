import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../config/firebase';
import '../App.css'

const UserView = () => {
  const [JobsData, setJobsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category
  const nav = useNavigate();
  const userId = localStorage.getItem('uid');
  const userName = localStorage.getItem('name');
  const userEmail = localStorage.getItem('email')
  console.log(userId);

  useEffect(() => {
    const fetchJobDataAtUserPanel = async () => {
      await firestore.collection('AllJobs').where('jobVacant', '==' ,'true').get().then((snap) => {
        const allJobsData = [];
        snap.forEach((doc) => {
          allJobsData.push(doc.data());
          console.log(allJobsData);
        });
        setJobsData(allJobsData);
      });
    };
    fetchJobDataAtUserPanel();
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
    console.log(userId);
    nav('/login');
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter jobs based on selected category
  const filteredJobs = selectedCategory === 'All'
    ? JobsData
    : JobsData.filter(job => job.selectedCategory === selectedCategory);

  // Handle Applied for job
  const handleAppliedForJob = async (data) => {
    
    // console.log(data.jobTitle)
    // console.log(data.jobDescription)
    const userDataForAppliedData = {
        userId,
        userName,
        userEmail,
        'jobTitle': data.jobTitle,
        'jobDescription': data.jobDescription,
        'jobId':data.jobId,
        'status': 'pending'
      }

      await firestore.collection('Applied-Jobs').doc(userId).set(userDataForAppliedData)
      .then(()=>{
        alert('Applied successfully')
      }).catch((e)=>{
        alert(e)
      })

  } 
  return (
    <div className='min-w-full min-h-screen flex flex-col justify-center items-center font-lato  relative'>
      <div className='flex justify-around items-center h-auto min-w-full sticky top-0 left-0 right-0 bg-blue-400 text-blue-900'>
        <h1 className='text-5xl font-bold font-playfair'>LOGO</h1>
        <p className='text-center p-6 text-3xl font-bold'>Welcome To User View Panel</p>
        <div className='btn'>
          <Link to={'/appliedJobs'} className='text-lg font-bold border-2 border-blue-900 hover:bg-blue-900 hover:text-white rounded-full px-4 py-2'>Response from Admin</Link>
          <button onClick={handleLogOut}
            className=' m-2 px-4 py-2 font-bold text-white bg-blue-900 rounded-full hover:bg-blue-400 hover:border-2 hover:border-blue-900 hover:text-blue-900'>
           Logout
          </button>

        </div>
      </div>
      
      <div className=' flex flex-col min-w-full min-h-screen  rounded-md bg-slate-50 '>
        <div className='filter-job w-full text-xl font-bold text-blue-900 my-4 flex justify-around items-center'>
          <div onClick={() => handleCategoryClick('All')}
               className={`hover:bg-slate-50 p-3 rounded-md cursor-pointer ${selectedCategory === 'All' ? 'bg-blue-200' : ''}`}>
            All
          </div>
          <div onClick={() => handleCategoryClick('Frontend Developer')}
               className={`hover:bg-slate-50 p-3 rounded-md cursor-pointer ${selectedCategory === 'Frontend Developer' ? 'bg-blue-200' : ''}`}>
            Frontend Developer
          </div>
          <div onClick={() => handleCategoryClick('Backend Developer')}
               className={`hover:bg-slate-50 p-3 rounded-md cursor-pointer ${selectedCategory === 'Backend Developer' ? 'bg-blue-200' : ''}`}>
            Backend Developer
          </div>
          <div onClick={() => handleCategoryClick('Ui/Ux Designer')}
               className={`hover:bg-slate-50 p-3 rounded-md cursor-pointer ${selectedCategory === 'Ui/Ux Designer' ? 'bg-blue-200' : ''}`}>
            Ui/Ux Designer
          </div>
          <div onClick={() => handleCategoryClick('Devops')}
               className={`hover:bg-slate-50 p-3 rounded-md cursor-pointer ${selectedCategory === 'Devops' ? 'bg-blue-200' : ''}`}>
            Devops
          </div>
        </div>

        <div className='card-container w-full flex justify-center flex-wrap'>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((val, ind) => (
              <div key={ind} className='card  gap-6 m-6 p-6  text-black w-80 h-auto bg-slate-50 hover:border-2 border-slate-50 rounded-md'>
                {/* <h1 className='my-2'>Category: {val.selectedCategory}</h1> */}
                <h1 className=' text-xl font-bold text-black '>{val.jobTitle}</h1>
                <p className=''>{val.jobDescription}</p>
                <p className=''>Minimum Experience  {val.jobExperience}</p>
                <div className='flex justify-between items-center'>
                    <p className=''>Salary Package  Rs{val.jobSalaryOffer}</p>
                    <button onClick={(e)=>handleAppliedForJob(val)} 
                      className='bg-blue-500 hover:bg-blue-700 text-white  w-36 px-1 py-3 rounded-md font-bold ' >
                      Apply for Job
                    </button>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;