  import axios from 'axios';
// import React, { useState } from 'react'
// import { json } from 'express';
 import { useState } from 'react'
import { Link } from 'react-router-dom'
 import { toast } from 'react-toastify'
 import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

 const Login = () => {

  const navigate=useNavigate();
  const {setAuthUser}=useAuth();

   const [userInput,setInput]=useState({});
   const [loading,setLoading]=useState(false);

  const handelInput=(e)=>{
     setInput({
      ...userInput,[e.target.id]:e.target.value
     })
  }
  console.log(userInput);
   const handleSubmit=async(e)=>{
    e.preventDefault();
     setLoading(true);
       try{
        const login=await axios.post('/api/auth/login',userInput);
        const data=login.data;
        if(data.success===false){
           setLoading(false);
          console.log(data.message);
         }
       
toast.success(data.message);
localStorage.setItem('chat-app',JSON.stringify(data));
setAuthUser(data);
 setLoading(false);
 navigate('/');
       }catch(error){
        setLoading(false);
        console.log(error);
        toast.error(error?.response?.data?.message);
       }
       
   }   

    return (
      <>
      
        <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-lg
           bg-clip-padding  backderop-filter
           backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-bold text-center text-gray-300'>Login
                    <span className='text-green-400'> Chatters </span>
                    </h1>
                    <form  onSubmit={handleSubmit} className='flex flex-col text-black'>    
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Email :</span>
                            </label>
                            <input
                                id='email'
                                type='email'
                                 onChange={handelInput}
                                placeholder='Enter your email'
                                required
                                className='w-full input input-bordered bg-blue-200 h-10 px-5' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                            </label>
                            <input
                                id='password'
                                type='password'
                                onChange={handelInput}
                                placeholder='Enter your password'
                                required
                                className='w-full input input-bordered bg-blue-200   outline-blue-500 h-10 px-5' />
                        </div>
                        <button type='submit'
                            className='mt-4 self-center 
                            w-auto px-2 py-1 bg-green-600 
                            text-lg hover:bg-green-500 
                            text-white rounded-lg hover: scale-105'>
                           {loading ? "loading..":"Login"}
                            </button>
                    </form>
                     <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-gray-500'>
                            Don't have an Acount ? <Link to={'/register'}>
                                <span
                                    className='text-gray-950 
                            font-bold underline cursor-pointer
                             hover:text-blue-500'>
                                    Register Now!!
                                </span>
                            </Link>
                        </p>
                    </div> 
            </div>
        </div>
        </>
    )
   }

export default Login