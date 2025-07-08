import React from 'react'
import { Tektur } from "next/font/google";
import Button from './Button';

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

export default function Login() {
  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4 '>
        <h3 className={'font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl ' + tektur.className}>Log in / Register</h3>
        <p>Almost there!</p>
        <input className='max-w-[350px] w-full mx-auto px-3 duration-200 hover:border-pink-600 py-2 sm:py-3 border border-solid border-pink-400 rounded-full outline-pink-500' placeholder='Email'/>
        <input className='max-w-[350px] w-full mx-auto px-3 duration-200 hover:border-pink-600 py-2 sm:py-3 border border-solid border-pink-400 rounded-full outline-pink-500' placeholder='Password' type="password"/>
        <div className='max-w-[350px] w-full mx-auto'>
            <Button text='Submit' dark={false} widthFull={true}/>
        </div>
        <p>No account? <span className='text-pink-500'>Sign up</span></p>
    </div>
  )
}
