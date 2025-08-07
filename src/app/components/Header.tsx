'use client'

import React from 'react'
import { Tektur } from "next/font/google";
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});


export default function Header() {

  const router = useRouter();
  const { logout, currentUser } = useAuth()

  const handleTitleClick = () => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/')
    }
  }

  const handleLogout = async () => {

    console.log('before try')
    try {
      console.log('inside try')
      return await logout()
    } catch (error) {
      console.error("Error logout", error)
    }
    
  }

  return (
    <div className='p-4 sm:p-8 flex items-center justify-between gap-4'>

      <button onClick={handleTitleClick}>
        <h1 className={'text-base sm:text-lg textGradient font-bold ' + tektur.className}>Feel Together</h1>
      </button>
      <div className='flex items-center justify-between'>
        <p>PLACEHOLDER STATS / GROUP</p>
        <button
          onClick={handleLogout}
          className='bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded'
        >
          Logout
        </button>
      </div>
    </div>
  )
}
