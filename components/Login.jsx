'use client'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  

  const {login, signup} = useAuth();
  const router = useRouter();

  const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const cantAuth = !emailRegex.test(email) || password.length < 6
    
 
  async function handleAuthUser(){
    //check if email is legit and password is acceptable
     
    if(cantAuth){
      return
    }

   setIsAuthenticating(true);

    try{

      if(isRegister){
          await signup(email, password);
      } else {

        await login(email, password);

      }
      router.push('/notes');
    
    }
    catch (err){
      console.log(err.message);
    }
    finally {
        setIsAuthenticating(false);

    }
  }
  return (
    <>
      <div className='login-container'>
        <h1 className='text-gradient '>Da Vinci Diary</h1>
        <h2 className='contrast'>Easy But Inventive Notetaking</h2>
        <p className='contrast'>Leave a mark in the annals of history of your own daily bits</p>
        <div className="full-line"></div>
        <h6 className='contrast'>{isRegister?"Create an account": "Log in"}</h6>
        <div >
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} id="email" type="email" placeholder="Enter your email address" />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} id="password" type="password" placeholder={isRegister?"Min. 6 characters":"******"} />
        </div>
        <button onClick={handleAuthUser} disabled={cantAuth || isAuthenticating} className='submit-btn'>
            <h6>{isAuthenticating?'Submitting...':'Submit'}</h6>
        </button>
        <div className='secondary-btns-container'>
            <button onClick={()=>{
              setIsRegister(!isRegister)
              }} className='card-button-secondary'>
                <small>{isRegister?"Log in":"Sign up"}</small>
            </button>
            <button className='card-button-secondary'>
                <small>Forgot password?</small>
            </button>
        </div>
        <div className='full-line'></div>
        <footer>
            <a target="blank" href="https://github.com/soushiki">
                <i className="fa-brands fa-github"></i>
            </a>
        </footer>
      </div>
    </>
  )
}
