import React from 'react'
import Link from 'next/link'
import { Tektur } from "next/font/google";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});


export default function Header() {
  return (
    <div className='p-4 sm:p-8 flex items-center justify-between gap-4'>
      <Link href={'/'}>
        <h1 className={'text-base sm:text-lg textGradient font-bold ' + tektur.className}>Feel Together</h1>
      </Link>
      <div className='flex items-center justify-between'>PLACEHOLDER STATS / GROUP</div>
    </div>
  )
}
