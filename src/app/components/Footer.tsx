import React from 'react'
import { Tektur } from "next/font/google";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

export default function Footer() {
    
    const currentYear = (new Date()).getFullYear()

    return (
        <div className='p-4 sm:p-8 grid place-items-center'>
            <p className={'text-pink-400 ' + tektur.className}>&copy; {currentYear} Pascual Felicio</p>
        </div>
    )
}
