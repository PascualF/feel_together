'use client'

import React, { useState } from 'react'
import { Tektur } from "next/font/google";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

type MoodEntry = {
  emoji: string;
  user: string;
  group: string;
}

const mockCalendarData: { [day: number]: MoodEntry[] } = {
  1: [{emoji: '😊', user: 'Pascual', group: 'Default' }],
  2: [{emoji: '😊', user: 'Janine',  group: 'Default' }, {emoji: '😬', user: 'Bob', group: 'Default' }],
  5: [
    {emoji: '😔', user: 'Pascual', group: 'Default'}, 
    {emoji: '😠', user: 'Janine', group: 'Default'}, 
    {emoji: '😭', user: 'Kelly', group: 'Default'}
  ],
  10: [{emoji: '💩', user: 'Pascual', group: 'Default'}],
  14: [{emoji: '🥵', user: 'Janine', group: 'Default'}, {emoji: '😊', user: 'Pascual', group: 'Default'}],
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'Septembre', 'October', 'November', 'December'
]

const weekDaysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = new Date()

export default function Calendar({ selectedGroup }: {selectedGroup : string}) {

  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  /* const { demoDisplay } = props */

  const year = currentDate.getFullYear()
  const monthIndex = currentDate.getMonth()

  const firstDay = new Date(year, monthIndex, 1).getDay()
  const totalDays = new Date(year, monthIndex + 1, 0).getDate()

  const daysArray = Array.from({ length: firstDay + totalDays }, (_, index) => {
    if (index < firstDay) return null
    return index - firstDay + 1
  })

  return (
    <div className='flex flex-col text-center'>
      <h3 className={'pb-4 ' + tektur.className}>{months[monthIndex]}</h3>

      {/*  Week days row */}
      <div className='text-center grid grid-cols-7'>
        {weekDaysList.map((dayWeek, index) => (
            <p key={index}>{dayWeek}</p>
          ))}
      </div>

      {/* Calendar grid */}
      <div className='text-center grid grid-cols-7'>
        {daysArray.map((day, index) => {
          if(!day) return <div key={index}></div> // Empty cell

          const allMoods = mockCalendarData[day ?? 0] || [];
          const groupMoods = allMoods.filter((mood) => mood.group === selectedGroup);
          
          return (
            <div key={index} className='relative'>
              <div
                className='h-[60px] m-2 border border-gray-300 text-left text-top p-1 rounded shadow-lg cursor-pointer hover:bg-pink-50 transition'
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              >
                <p className={'text-sm mb-1 ' + tektur.className}>{day}</p>
                
                {/* Stacked emojis */}
                <div className='relative h-5 w-[80px]'>
                  {groupMoods.map((mood, emojiIndex) => (
                      <span
                        key={emojiIndex}
                        className='absolute text-sm'
                        style={{
                          left: `${emojiIndex * 8}px`,
                          zIndex: groupMoods.length - emojiIndex,
                        }}
                      >
                        {mood.emoji}
                      </span>
                  ))}
                </div>
              </div>

              {/* Popup bubble on selected day */}
              { selectedDay === day && groupMoods.length > 0 && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-black text-white text-xs rounded z-50 w-max shadow-xl animate-fadeInScale">
                  <p className='mb-1 font-semibold'>Moods on day {day}:</p>
                  {groupMoods.map((mood, index) => (
                    <p key={index}>{mood.user} felt {mood.emoji}</p>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
