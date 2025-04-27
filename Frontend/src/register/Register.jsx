import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  
  const navigate=useNavigate();
  const {setAuthUser}=useAuth();

  const [loading,setLoading]=useState(false);
  const [inputData,setInputData]=useState({});



const handelInput=(e)=>{
  setInputData({
    ...inputData,[e.target.id]:e.target.value
  })
}
 console.log(inputData);

const handleSubmit=async(e)=>{
  e.preventDefault()
  if(inputData.password!=inputData.confirmpass.toLowerCase()){
    setLoading(false);
    return toast.error("Password Dosen't Match");
  }
   try{
      const register = await axios.post('/api/auth/register',inputData);
      const data =register.data;
      if(data.success===false){
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
localStorage.setItem('chat-app',JSON.stringify(data));
setAuthUser(data);
setLoading(false);
navigate('/login');
   }catch(error){
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message)
   }
}

const selectGender = (selectedGender) => {
  setInputData((prev) => ({
    ...prev,
    gender: selectedGender === inputData.gender ? '' : selectedGender,
  }));
}

  return (
   <>
   <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-lg
           bg-clip-padding  backderop-filter
           backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-bold text-center text-gray-300'>Register
                    <span className='text-green-400'> Chatters </span>
                    </h1>
                    <form onSubmit={handleSubmit} className='flex flex-col text-black'>    
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Fullname :</span>
                            </label>
                            <input
                                id='fullname'
                                type='text'
                                 onChange={handelInput}
                                placeholder='Enter your Fullname'
                                required
                                className='w-full input input-bordered bg-blue-200 h-10 px-5' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Username :</span>
                            </label>
                            <input
                                id='username'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter UserName'
                                required
                                className='w-full input input-bordered bg-blue-200    h-10 px-5' />
                        </div>
                       
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
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Confirm Password :</span>
                            </label>
                            <input
                                id='confirmpass'
                                type='confirm'
                                onChange={handelInput}
                                placeholder='Confirm password'
                                required
                                className='w-full input input-bordered bg-blue-200   outline-blue-500 h-10 px-5' />
                        </div>
                        <div id='gender' className='flex gap-2'>
                          <label  className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-grey-990'>male</span>
                            <input type='Checkbox' onChange={()=>selectGender('male')} checked={inputData.gender==='male'} className='Checkbox Checkbox-info'/>
                          </label>
                          <label  className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-grey-990'>female</span>
                            <input type='Checkbox'  onChange={()=>selectGender('female')} checked={inputData.gender==='female'} className='Checkbox Checkbox-info'/>
                          </label>
                        </div>


                        <button type='submit'
                            className='mt-4 self-center 
                            w-auto px-2 py-1 bg-green-600 
                            text-lg hover:bg-green-500 
                            text-white rounded-lg hover: scale-105'>
                           {loading ? "loading..":"Register"}
                            </button>
                    </form>
                    <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-gray-500'>
                           Do you have an Acount ? <Link to={'/login'}>
                                <span
                                    className='text-gray-950 
                            font-bold underline cursor-pointer
                             hover:text-blue-500'>
                                    Login Now!
                                </span>
                            </Link>
                        </p>
                    </div> 
            </div>
        </div>
   </>
  )
}
