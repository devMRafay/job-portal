import React, { useEffect, useState } from 'react'
import { firestore } from '../config/firebase'


const AppliedJobs = () => {
    let userId = localStorage.getItem('uid')
    const [acceptedAppliedJobs, setAcceptedAppliedJobs] = useState([])
    useEffect(()=>{
    const fetchAcceptedAppliedJobs = async () => {
        const allAcceptedJobsData=[]
        await firestore.collection('Applied-Jobs').where('userId', '==', userId).where('status', '==', 'Accepted').get()
        .then((snap)=>{
            snap.forEach((doc) => {
                allAcceptedJobsData.push(doc.data());
                console.log(allAcceptedJobsData);
              });
              setAcceptedAppliedJobs(allAcceptedJobsData)
        }).catch((e)=>{
            alert('error message while fetching data', e)
        })


    }

    fetchAcceptedAppliedJobs()
},[])


    return (
    <div className='w-full h-full font-lato bg-slate-50 '>
        <div>
            <h1 className=' text-4xl font-bold flex justify-center items-center w-full p-6 bg-blue-400 text-white '>Applied Jobs</h1>
        </div>
        <div className='card-container w-full h-screen flex  flex-wrap'>

            {
                acceptedAppliedJobs.map((val,ind)=>{
                    return(
                        <div key={ind} className='card  gap-6 mx-6 my-20 p-6  text-black w-80 h-64 bg-slate-50 hover:border-2 border-slate-50 rounded-md '>
                            <h1 className='text-xl font-bold text-black '>{val.jobTitle}</h1>
                            <p>Id:  {val.jobId}</p>
                            <p>{val.jobDescription}</p>
                            <p className="bg-green-500 hover:bg-green-600 rounded-md text-white px-4 py-2 text-center font-bold ">Status: {val.status}</p>
                        </div>         
                    )
                })
            }
        </div>
    </div>
  )
}

export default AppliedJobs;
