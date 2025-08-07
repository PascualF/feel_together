'use client'

import React, { useEffect, useState } from 'react'
import { Tektur } from "next/font/google";
import Button from './Button';
import Loading from './Loading';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

export default function Login() {
  const [ email , setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ isLogin, setIsLogin ] = useState(true) // will toggle login/register => need to check when login or signup
  const [ error, setError ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false)

  const { login, signup, currentUser } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if(currentUser) {
      router.push('/dashboard')
    }
  }, [currentUser, router])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
  
    try {
      if(isLogin) {
        await login(email, password)
      } else {
        await signup(email, password, username)
      }
    } catch (error){
      if(error instanceof Error) setError(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4 '>
        <h3 className={'font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl ' + tektur.className}>
          {isLogin ? 'Log in' : 'Register'}
        </h3>
        <p>Almost there!</p>

        {!isLogin && (
          <input 
            className='max-w-[350px] w-full mx-auto px-3 duration-200 hover:border-pink-600 py-2 sm:py-3 border border-solid border-pink-400 rounded-full outline-pink-500' 
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input 
          className='max-w-[350px] w-full mx-auto px-3 duration-200 hover:border-pink-600 py-2 sm:py-3 border border-solid border-pink-400 rounded-full outline-pink-500' 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className='max-w-[350px] w-full mx-auto px-3 duration-200 hover:border-pink-600 py-2 sm:py-3 border border-solid border-pink-400 rounded-full outline-pink-500' 
          placeholder='Password' 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <div className='max-w-[350px] w-full mx-auto'>
            <Button 
              text='Submit' 
              dark={false} 
              widthFull={true}
              onClick={handleSubmit}
            />
        </div>

        <p>
          {isLogin ? "No account?" : "Already registered?"}
          <span 
            className='text-pink-500 cursor-pointer ml-2'
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>


          
        </p>
        {isLoading && <Loading />}
    </div>
  )
}
