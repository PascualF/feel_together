import React from 'react'
import { Tektur } from "next/font/google";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

export default function Button({
    text, dark, widthFull
} : {
    text: string, 
    dark: boolean,
    widthFull: boolean
}) {

  return (
    <button className={
        'rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border border-solid border-pink-400 ' 
        + (dark ? 'text-white bg-pink-400 ' : ' text-pink-400 bg-white ') 
        + (widthFull && 'grid place-items-center w-full ')}
    >
        <p className={'px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ' + tektur.className}>{text}</p>
    </button>
  )
}
