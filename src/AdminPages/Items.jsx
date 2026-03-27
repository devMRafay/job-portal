import React, { useEffect, useState } from 'react'
import { db, firestore } from '../config/firebase'

const Items = () => {
    
    const [jobTitle, setJobTitle] =  useState('')
    const [jobExperience, setJobExperience] = useState('')
    const [jobSalaryOffer, setJobSalaryOffer] = useState('')
    const [jobDescription ,setJobDescription] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [jobList, setJobList] = useState([])
    
    const handleAddJob = async () => {
      // Generate a unique job key
      const jobKey = db.ref('jobkey').push().key; 
      
      console.log(jobKey);
    
      const jobData = {
        jobTitle,
        jobDescription,
        jobExperience,
        jobSalaryOffer,
        selectedCategory,
        'jobId': jobKey,
        'jobVacant': 'true' 
      };
    
      // Add the job to Firestore
      await firestore.collection('AllJobs').doc(jobKey).set(jobData)
        .then(() => {
          console.log('Job added successfully');
        })
        .catch((e) => {
          console.log('Error adding job:', e);
        });
    };

    useEffect(() => {
      const fetchingAllJobs = async () => {
        await firestore.collection('AllJobs').where('jobVacant', '==', 'true').get()
          .then((snap) => {
            const allJobs = []
            snap.forEach((doc)=>{
              allJobs.push(doc.data())
              // setJobData(...[doc.data()])
                console.log(allJobs)
            })
            setJobList(allJobs)
            console.log(jobList)
          })
          .catch((e) => {
            console.log('Error fetching jobs:', e);
          });
          // console.log(jobData)
      };
    
      fetchingAllJobs();
    }, []);


    const handleDelete = async (val) =>{
      console.log(val.jobId)
      const jobID = val.jobId 
      await firestore.collection('AllJobs').doc(jobID).delete()
      
    }
  return (
    

    <div className='min-w-full min-h-full flex flex-col justify-start items-center gap-8 overflow-auto touch-pan-yoverflow-auto touch-pan-y font-lato'>
      <div className='text-center '>
        <h1 className='text-4xl font-bold'> Jobs Listing </h1>
        </div>

      <div className='flex flex-col '>
        
        {/* Job title */}
        <input type="text" placeholder='Job title' 
        value={jobTitle} 
        onChange={(e)=>setJobTitle(e.target.value)}
        className='w-80 h-12 my-2 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600' />

        {/* Job Description */}
        <input type="text" placeholder='Job description' 
        value={jobDescription} 
        onChange={(e)=>setJobDescription(e.target.value)}
        className='w-80 h-12 my-2 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600' />
        
        {/* Job Experience */}
        <input type="text" placeholder='Experience' value={jobExperience} 
        onChange={(e)=>setJobExperience(e.target.value)}
        className='w-80 h-12 my-2 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600'
        />
        
        {/* Job Salary */}
        <input type="text" placeholder='Salary package' value={jobSalaryOffer} 
        onChange={(e)=>setJobSalaryOffer(e.target.value)}
        className='w-80 h-12 my-2 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600'
        />

        <select name="" id="" value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}
          className='w-80 h-12 my-2 border-2 border-solid text-slate-500 focus:border-slate-500'
          >
          <option value="Ui/Ux Designer">Ui/Ux Designer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Devops">DevOps</option>
        </select>

        <button  className='border-2 border-transparent rounded-md h-12 w-80 px-6 py-2 my-2 text-white bg-blue-400 font-bold hover:bg-blue-600' onClick={handleAddJob}>Add Job</button>
      </div>

      {/* render Job List */}
      <div>
        <h1 className='text-4xl font-bold text-center my-4'>JOBs LIST</h1>
        <table >
          <th>
            <tr className='flex gap-2  text-center '>
            <td className='border-2 w-24'>Job Title</td>
            <td className='border-2 w-96' >Job Description</td>
            <td className='border-2 w-24'>Job Category</td>
            <td className='border-2 w-24'>Experience</td>
            <td className='border-2 w-24'>Salary</td>
            <td className='border-2 w-24'>Action</td>
            </tr>
          </th>
          <tbody>

          {jobList.map((val,ind)=>{
            return(

              <tr className='flex gap-2 my-2 text-center' key={ind}>
                <td className='border-2 w-24'>{val.jobTitle}</td>
                <td className='border-2 w-96'>{val.jobDescription}</td>
                <td className='border-2 w-24'>{val.selectedCategory}</td>
                <td className='border-2 w-24'>{val.jobExperience}</td>
                <td className='border-2 w-24'>{val.jobSalaryOffer}</td>
                <td className='w-24'><button onClick={(e)=>handleDelete(val)} className='w-full h-full bg-red-600 text-white font-bold rounded-md'>Delete Job</button></td>
            </tr>
            )
          })
          
          }
        
          </tbody>
          
        </table>
      </div>

    </div>
  )
}

export default Items
