'use client';

import React, { useState } from 'react'
import { Tektur } from "next/font/google";
import Calendar from './Calendar';

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

interface DataTypes {
  num_Days: number,
  time_Remaining: string,
  date: string
}

interface MoodTypes {
    'Sad': string,
    'Happy': string,
    'Horny': string,
    'Anxious': string,
    'Calm': string,
    'Poop': string,
    'Depressed': string,
    'Angry': string,
    'Sick': string,
    'Mimi': string,
}

/* interface MoodEntry {
  group: string;
  date: string;
  mood: keyof MoodTypes;
} */

/* Moods to add: Sad, Happy, Horny, Anxious/Mimi, calm, depressed, Nervous
  Annoyed, Surprised, Angry, Frustrated, Confused; Scared, Embarrased */

export default function Dashboard() {

  const [selectedGroup, setSelectedGroup] =  useState<string>('Default')
  /* const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]) */

  const mockData: DataTypes = {
    num_Days: 14,
    time_Remaining: '13:14:26',
    date: (new Date()).toDateString()
  }

  const groupsMock = [
    { name: 'Your Mood', color: 'bg-pink-100 text-pink-600'},
    { name: 'Work', color: 'bg-blue-100 text-blue-600'},
    { name: 'Family', color: 'bg-green-100 text-green-600'},
    { name: 'Gym', color: 'bg-yellow-100 text-yellow-600'}
  ]

  const emojiMoodTracking: MoodTypes = {
    'Sad': '😭',
    'Happy': '😊',
    'Horny': '🥵', /* +18, appear when creating account and confirming 18 years old at least */
    'Anxious': '😬',
    'Calm': '😌',
    'Poop': '💩',
    'Depressed': '😔',
    'Angry': '😠',
    'Sick': '🤒',
    'Mimi': '🤪'
  }

  return (
    <div className='flex flex-col flex-1 gap-10 sm:gap-14 md:gap-20'>
      
      <div className='grid grid-cols-1 sm:grid-cols-3 bg-pink-50 text-pink-500 rounded'>
        {(Object.keys(mockData) as (keyof DataTypes)[]).map((key) => {
          return (
            <div key={key} className='p-4 flex flex-col sm:text-center gap-1 sm:gap-2'>
              <p className='font-medium uppercase text-xs sm:text-sm'>{key.replaceAll('_', ' ')}</p>
              <p className={' ' + tektur.className}>{mockData[key]}</p>
            </div>
          )
        })}
      </div>
      <div className='text-center '>
        <select 
          className='p-2 rounded bg-pink-100 text-pink-600'
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groupsMock.map(group => (
            <option key={group.name} value={group.name}>{group.name}</option>
          ))}
        </select>
      </div>
      
      <h4 className={'text-4xl sm:text-5xl md:text-6xl text-center ' + tektur.className}>
        {/* Ready to <span className='textGradient'>feel</span> it out? */}
        How are you <span className='textGradient'>feeling</span> right now?
        {/* Capture your feelings today? */}
        {/* What's your feeling vide today? */}
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {(Object.keys(emojiMoodTracking) as (keyof MoodTypes)[]).map((mood, moodIndex) => {
          return (
            <button className={'p-4 rounded-lg pinkShadow duration-200 bg-pink-100 hover:bg-pink-200 text-center flex flex-col gap-3 flex-1 ' + (moodIndex === 8 && 'col-span-2 ')} key={moodIndex}>
              <p className={'text-4xl sm:text-5xl md:text-6xl'}>{emojiMoodTracking[mood]}</p>
              <p className={'text-pink-500 text-xs sm:text-sm md:-text-base ' + tektur.className}>{mood}</p>
            </button>
          )
        })}
      </div>
      <Calendar selectedGroup={selectedGroup}/>
    </div>
  )
}
