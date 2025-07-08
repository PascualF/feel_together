import React from 'react'
import { Tektur } from "next/font/google";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const currentDate = new Date()

const weekDaysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar(/* { props }: { props: string} */) {

  /* const { demoDisplay } = props */

  const year = 2025
  const monthIndex = months.indexOf('Aug') // July

  const firstDay = new Date(year, monthIndex, 1).getDay()
  const totalDays = new Date(year, monthIndex + 1, 0).getDate()

  const daysArray = Array.from({ length: firstDay + totalDays }, (_, index) => {
    if (index < firstDay) return null
    return index - firstDay + 1
  })

  return (
    <div className='flex flex-col text-center'>
      <h3 className={'pb-4 ' + tektur.className}>August</h3>
      <div className='text-center grid grid-cols-7'>
        {weekDaysList.map((dayWeek, index) => {

          return (
            <p key={index}>{dayWeek}</p>
          )
        })}
      </div>
      <div className='text-center grid grid-cols-7'>
        
        {daysArray.map((day, index) => {

          let color = ''

          return (
            <div key={index}>
              
              <p key={index} className='p-5'>{day}</p>
            </div>
            
          )
        })}
      </div>
    </div>
  )
}
