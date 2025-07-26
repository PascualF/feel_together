'use client'

import React from 'react'
import Button from './Button';
import Calendar from './Calendar';
import { Tektur } from "next/font/google";
import Link from 'next/link';
import mockCalendarData from '../../../lib/data/demoMockData';

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});


export default function Hero() {
  return (
    <div className='py-10 md:py-14 flex flex-col gap-4 sm:gap-8'>
        <h1  className={'text-5xl sm:text-6xl md:text-7xl text-center ' + tektur.className}><span className='textGradient'>Feel Together</span> tracking your mood <span className='textGradient'>together</span> daily!</h1>
        <p className='text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]'>Create your mood record together and see <span className='font-semibold'>how you feel daily</span> all year.</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-fit mx-auto'>
            <Button text={'Sign up'} dark={false} widthFull={false}/>
            
            <Link href="/dashboard">
              <Button text={'Login'} dark={true} widthFull={false}/>
            </Link>
        </div>
        <Calendar selectedGroup={''} onMoodSelect={(mood) => console.log(mood)} calendarData={mockCalendarData} />
    </div>
  )
}
