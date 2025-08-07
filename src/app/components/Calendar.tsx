'use client'

import React, { useEffect, useState } from 'react'
import { Tektur } from "next/font/google";
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

type MoodEntry = {
  emoji: string;
  user: string;
  username: string | null | undefined;
  group: string;
}

interface CalendarProps {
  selectedGroup : string,
  loadingData: boolean;
  onMoodSelect: (
    mood: string,
    day: number,
    month: number,
    year: number,
    group: string,
  ) => void;
  calendarData: {
    [year: number]: {
      [month: number]: {
        [day: number]: MoodEntry[]
      }
    }
  }
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'Septembre', 'October', 'November', 'December'
]

const weekDaysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar({selectedGroup, loadingData, calendarData}: CalendarProps) {

  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [currentMonthIndex, setcurrentMonthIndex] = useState<number>(new Date().getMonth())
  /* const { demoDisplay } = props */

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  if(!currentDate) return null;

  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay()
  const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate()

  const daysArray = Array.from({ length: firstDay + totalDays }, (_, index) => {
    if (index < firstDay) return null
    return index - firstDay + 1
  })

  const goToPreviousMonth = () => {
    setcurrentMonthIndex((prev) => {
      if(prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
  }

  const goToNextMonth = () => {
    setcurrentMonthIndex((prev) => {
      if(prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
  }

  /* if(!calendarData || !calendarData[currentYear]) {
    return (
      <div>Loading Calendar...</div>
    )
  } */

  return (
    <div className='flex flex-col text-center'>
      <h3 className={'pb-4 ' + tektur.className}>
        <button onClick={goToPreviousMonth} className='text-xl hover:scale-100 transition mr-2 cursor-pointer'>&lt;</button>
        {months[currentMonthIndex]} {currentYear}
        <button onClick={goToNextMonth} className='text-xl hover:scale-100 transition ml-2 cursor-pointer'>&gt;</button>
      </h3>

      {/*  Week days row */}
      <div className='text-center grid grid-cols-7'>
        {weekDaysList.map((dayWeek, index) => (
            <p key={index}>{dayWeek}</p>
          ))}
      </div>

      <div className=''>
        {/* LDRS, bouncy loading button while fetching data */}
        {loadingData && (
            <Bouncy
              size="30"
              speed="1.00"
              color="pink" 
            />
          )}
      </div>

      {/* Calendar grid */}
      <div className='text-center grid grid-cols-7'>
        {daysArray.map((day, index) => {
          if(!day) return <div key={index}></div> // Empty cell

          const allMoods = calendarData[currentYear]?.[currentMonthIndex]?.[day ?? 0] || [];
          const groupMoods = allMoods.filter((mood) => mood.group === selectedGroup);
          const isTodayDate = 
            (
              day === currentDate.getDate() &&
              currentMonthIndex === currentDate.getMonth() &&
              currentYear === currentDate.getFullYear()
            )

          return (
            <div key={index} className='relative'>
              <div
                className={'h-[60px] m-2 border border-gray-300 text-left text-top p-1 rounded shadow-lg cursor-pointer hover:bg-pink-50 transition ' +
                  (isTodayDate && ' bg-pink-200 border-gray-500')
                }
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
                    <p key={index}>{mood.username} felt {mood.emoji}</p>
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
