'use client';

import React, { useState } from 'react'
import { Tektur } from "next/font/google";
import Calendar from './Calendar';
import MoodModal from './MoodModal';
import { useAuth } from '../../../context/AuthContext';

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

type MoodEntry = {
  emoji: string;
  user: string;
  group: string;
}

/* Moods to add: Sad, Happy, Horny, Anxious/Mimi, calm, depressed, Nervous
  Annoyed, Surprised, Angry, Frustrated, Confused; Scared, Embarrased */

const mockCalendarData: { 
  [year: number]: {
    [month: number]: {
      [day: number]: MoodEntry[]
    }
  }
  } = {
    2025: {
      6: { // index of july
        1: [{emoji: '😊', user: 'Pascual', group: 'Your Mood' }],
        2: [{emoji: '😊', user: 'Janine',  group: 'Your Mood' }, 
          {emoji: '😬', user: 'Bob', group: 'Your Mood' },
          {emoji:'😊', user: 'Bill', group: 'Work'}
        ],
        5: [
          {emoji: '😔', user: 'Pascual', group: 'Your Mood'}, 
          {emoji: '😠', user: 'Janine', group: 'Your Mood'}, 
          {emoji: '😭', user: 'Kelly', group: 'Your Mood'}
        ],
      },
      5: {
        10: [{emoji: '💩', user: 'Pascual', group: 'Your Mood'}],
        14: [{emoji: '🥵', user: 'Janine', group: 'Your Mood'}, {emoji: '😊', user: 'Pascual', group: 'Your Mood'}],
        }
    }
};

export default function Dashboard() {

  const [selectedGroup, setSelectedGroup] =  useState<string>('Your Mood')
  /* const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]) */
  const [ calendarData, setCalendarData ] = useState(mockCalendarData)
  const [ selectedMood, setSelectedMood ] = useState<{emoji: string; group: string} | null>(null)
  const [ openModal, setOpenModal ] = useState(false)

  const { currentUser, userData } = useAuth()
  console.log( currentUser )
  console.log( userData )
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

  const handleMoodSelect = (
    mood: string,
    day: number,
    month: number,
    year: number,
    group: string,
  ) => {
    console.log("Selected mood: ", {mood, day, month, year, group})

    const user = 'Pascual' // this will be from user on useAuth

    //check if mood exists
    const existingMoods = calendarData[year]?.[month]?.[day] || []

    const alreadyAdded = existingMoods.some(
      (entry) => entry.user === user && entry.group === group
    )

    if( alreadyAdded ) {
      alert('You have already added a mood for this group')
      return;
    }

    const newEntry = {emoji: mood, user, group};
    const updatedData = {...calendarData}

    if (!updatedData[year]) updatedData[year] = {};
    if (!updatedData[year][month]) updatedData[year][month] = {}
    if (!updatedData[year][month][day]) updatedData[year][month][day] = []


    updatedData[year][month][day].push(newEntry)
    setCalendarData(updatedData)
    console.log(updatedData)
    console.log(newEntry)
    // all the info to go to firebase
    // exemple: saveMoodToFirebase({ mood. day, month, year, group })
  }

  const handleClickEmoji = (emoji: string) => {
    setSelectedMood({emoji, group: ''})
    setOpenModal(true)
  }

  const getGroupsWithMoodToday = (): string[] => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear();

    const user = 'Pascual' // this will be from user on useAuth

    return calendarData[currentYear]?.[currentMonth]?.[currentDay]
      ?.filter(entry => entry.user === user)
      .map(entry => entry.group) || []
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
            <button 
              className={'p-4 rounded-lg pinkShadow duration-200 bg-pink-100 hover:bg-pink-200 text-center flex flex-col gap-3 flex-1 ' + (moodIndex === 8 && 'col-span-2 ')} key={moodIndex}
              onClick={() => handleClickEmoji(emojiMoodTracking[mood])}
            >
              <p className={'text-4xl sm:text-5xl md:text-6xl'}>{emojiMoodTracking[mood]}</p>
              <p className={'text-pink-500 text-xs sm:text-sm md:-text-base ' + tektur.className}>{mood}</p>
            </button>
          )
        })}
      </div>
      <MoodModal 
        isOpen={openModal}
        mood={selectedMood}
        groups={groupsMock.map(g => g.name)}
        groupsWithMoodToday={getGroupsWithMoodToday()}
        onCancel={() => setOpenModal(false)}
        onConfirm={(selectedGroups) => {

          if (!selectedMood) return;
          console.log(mockCalendarData)
          const currentDate = new Date()
          const currentDay = currentDate.getDate()
          const currentMonth = currentDate.getMonth()
          const currentYear = currentDate. getFullYear()

          selectedGroups.forEach((groupName) => {
            handleMoodSelect(selectedMood.emoji, currentDay, currentMonth, currentYear, groupName)
          });
          setOpenModal(false)
        } }
      />
      <Calendar 
        selectedGroup={selectedGroup} 
        onMoodSelect={handleMoodSelect}
        calendarData={calendarData}
      />
    </div>
  )
}
