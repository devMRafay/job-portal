import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore, storage } from '../config/firebase';


function Home (){

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [link, setLink] = useState("")
  const nav = useNavigate()


  const imageUpload = async (e) => {
    
      console.log(e)
      var storageRef = storage.ref("image").child(e.target.files[0].name)
      await storageRef.put(e.target.files[0]).then((snapshot)=>{
        alert('Upload a blob or file!')
        // var message = 'Upload a blob or file!' 
        // Alert(message)
        storageRef.getDownloadURL().then((url)=>{
            // console.log(url)
            setLink(url)
        }).catch((e)=>{
            alert(e)
        })
      });
  }

  // function Alert(msg) {
  //   return (
  //     <div className="relative top-0 left-52 bg-red-500 text-white p-4 rounded-lg shadow-md">
  //       {/* This is an alert message! */}
  //       {msg}
  //     </div>
  //   );
  // }

  const signUp = async () => {
      await auth.createUserWithEmailAndPassword(email,password)
      .then(async (user)=>{
        // console.log(user)
        // console.log(user.user.uid)

        var userData = {
            email:email,
            password:password,
            name:name,
            userUid:user.user.uid,
            userType:"User",
            imageUrl:link,
        }

        await firestore.collection('users').doc(user.user.uid).set(userData)
        .then((snap)=>{
          alert('User data add in firestore')
          // console.log(userData)
          nav('/login')
        }).catch((e)=>{
          alert(e)
          // console.log(e)
        })

      })

      // console.log(firebase)
  }
  
  
  return (
    <>
     <div className='flex justify-center items-center min-w-full h-screen '>
       
        <div className='flex flex-col items-center justify-center w-[50%] h-screen text-center font-lato text-white bg-blue-400 flex-wrap'style={{backgroundColor:'#e7473c !important'}} >
              
                {/* <p>Already have an account?</p> */}
                <h1 className='py-6  text-6xl font-bold '>Welcome <br /> Back!</h1> 
                <p className='py-3 px-10 text-2xl font-sans text-white '>To Keep connected with us please login with your personal info</p>
                <Link to={'/login'} 
                className='border-2  border-white rounded-full h-12 w-52 px-6 py-2.5 my-6 font-bold
                  hover:bg-white hover: hover:text-blue-400'
                >LOGIN</Link>

        </div>


        <div className='flex flex-col justify-center items-center w-[50%] h-screen  font-lato '>


            {/* <h1 className='mt-6  text-4xl font-bold'>Sign up</h1> */}
            <h1 className='my-4 text-6xl font-bold text-center'>Create <br /> Account</h1>        
            {/* <label htmlFor='username'>UserName:</label> */}
            <input type='text' id='username' value={name} 
            onChange={(e)=>setName(e.target.value)}  
            className=' w-80 h-12 my-4 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500
            focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600
            '             

            placeholder='Name'/>
      
            {/* <label htmlFor='email'>Email:</label> */}
            <input type='text'id='email' value={email} 
            onChange={(e)=>setEmail(e.target.value)}
            className=' w-80 h-12 my-4 px-3 py-2 bg-slate-100  text-md  shadow-sm placeholder-slate-500
            focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600
            ' placeholder='Email' />
        
            {/* <label htmlFor='password'>UserName:</label> */}
            <input type='text' id='password' value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            className=' w-80 h-12 my-4 px-3 py-2 bg-slate-100  text-md shadow-sm placeholder-slate-500
            focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-600
            '
            placeholder='Password'/>

            {/* image upload */}
            <input type="file" onChange={(e)=>imageUpload(e)} className='mb-4 w-72 px-3 py-2 '/>

            <button className='border-2 border-transparent rounded-full h-12 w-52 px-6 py-2 mb-4 text-white bg-blue-400   font-bold hover:shadow-lg'
            onClick={()=>signUp()}
            >SIGN UP</button>
        </div>
            
          
      </div>
    
    </>
    
  )
}

export default Home
    