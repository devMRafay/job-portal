import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../config/firebase';



function Login(){

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const nav = useNavigate()

    const LoginUser = async () => {
        await auth.signInWithEmailAndPassword(email,password)
        .then(async (user)=>{
            console.log(user.user.uid)
            await firestore.collection('users').doc(user.user.uid).get()
            .then((snap)=>{
                console.log(snap.data()['name'])
                localStorage.setItem('uid',user.user.uid)
                localStorage.setItem('email',email)
                localStorage.setItem('name',snap.data()['name'])
                localStorage.setItem('image',snap.data()['imageUrl'])
                
                var userType = snap.data()['userType']
                
                userType ==  'Admin'  ?  nav('/AdminDashboard')  :  nav('/userView')

            }).catch((e)=>{
                alert('Error fetching data! ',e)
            })

            alert('Login successfully!')
        })
        .catch((e)=>{
            alert('Invalid credentials! ',e)
        })
    }

  return (
    <div className='flex justify-center items-center min-w-full h-screen  '>

    <div className='flex flex-col justify-center items-center w-[50%] h-screen font-lato'>

        <h1 className='my-6  text-6xl font-bold'>Sign in</h1> 
        {/* <p className='my-4 text-3xl font-thin'>Enter your credential to login</p>  */}


        {/* User-Email */}
        <input type="text"  value={email} onChange={(e)=> setEmail(e.target.value)}
        className='w-80 h-12 my-4 px-3 py-2 bg-slate-100  text-md font-lato shadow-sm placeholder-slate-500
        focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600
        ' placeholder='Email'/>

        {/*User-Password*/}
        <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)}
        className=' w-80 h-12 my-4 px-3 py-2 bg-slate-100  text-md font-lato shadow-sm placeholder-slate-500
        focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600
        ' placeholder='Password'/>

        {/* Login-Button */}
        <button onClick={()=>LoginUser()} 
        className='border-2 border-transparent rounded-full h-12 w-52 px-6 py-2 my-4 text-white bg-blue-400 font-bold shadow hover:shadow-lg '>SIGN IN</button>
        
    </div>

        {/*  */}
        <div className='flex flex-col items-center justify-center w-[50%] h-screen bg-blue-400 text-white flex-wrap  text-center font-lato'>
        <h1 className='my-6  text-6xl font-bold '>Hello, Friends!</h1> 
            <p className='py-3 px-10 text-2xl font-sans'>Enter your personal details and start journey with us </p>
            <Link to={'/'} 
            className='border-2  border-white rounded-full h-12 w-52 px-6 py-2.5 my-6 font-bold
                  hover:bg-white hover: hover:text-blue-400'
            >SIGN UP</Link>

        </div>
    </div>
  )
}

export default Login;
    



// Admin@gmail.com
// admin2000