'use client';

import React, { useEffect, useState } from 'react'
import { Tektur } from "next/font/google";
import Calendar from './Calendar';
import MoodModal from './MoodModal';
import { useAuth } from '../../../context/AuthContext';
import { saveMoodToFirestore } from '../../../lib/data/firebaseUtils';
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../../firebase"

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
  day: number;
  month: number;
  year: number;
}

/* Moods to add: Sad, Happy, Horny, Anxious/Mimi, calm, depressed, Nervous
  Annoyed, Surprised, Angry, Frustrated, Confused; Scared, Embarrased */

/* const mockCalendarData: { 
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
}; */

const fetchMoodEntries = async (userId: string) => {

  const queryFilteredByUserLogged = query(
    collection(db, "moods"),
    where("userId", "==", userId)
  );


  const querySnapshot = await getDocs(queryFilteredByUserLogged);

  const entries: MoodEntry[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if(data.userId === userId) {
      entries.push({
        emoji: data.emoji,
        user:data.userId,
        group: data.group,
        day: data.day,
        month: data.month,
        year: data.year
      })
    }
  })

  return entries;
}

export default function Dashboard() {

  // All states of the DashBoard........
  const [selectedGroup, setSelectedGroup] =  useState<string>('Your Mood')
  /* const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]) */
  const [ calendarData, setCalendarData ] = useState<{
    [year: number]: {
      [month: number]: {
        [day: number] : MoodEntry[]
      }
    }
  }>({})
  const [ selectedMood, setSelectedMood ] = useState<{emoji: string; group: string} | null>(null)
  const [ openModal, setOpenModal ] = useState(false)
  // Loading to handle fetching the data
  const [ isLoading, setIsLoading ] = useState(false)
  const { currentUser } = useAuth()


  // Mock data, this wil be auto...
  const mockData: DataTypes = {
    num_Days: 14, // This will be the streak
    time_Remaining: '13:14:26', // What could be the best time to start next day? Vaid for any country of course.
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

  const handleMoodSelect = async (
    mood: string,
    day: number,
    month: number,
    year: number,
    group: string,
  ) => {
    console.log("Selected mood: ", {mood, day, month, year, group})

    const user = currentUser?.uid;
    if(!user) return alert("You must be logged in");

    //check if mood exists, preveting double submissions
    const existingMoods = calendarData[year]?.[month]?.[day] || []
    const alreadyAdded = existingMoods.some(
      (entry) => entry.user === user && entry.group === group
    )

    if( alreadyAdded ) {
      alert('You have already added a mood for this group')
      return;
    }

    console.log('Before Firestore', user)

    // Save to firestore
    await saveMoodToFirestore({userId: user, group, emoji: mood, day, month, year})

    console.log('After Firestore', user)

    // Update UI
    const newEntry = {emoji: mood, user, group, day, month, year};
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

    setTimeout(() => {
      fetchMoodEntries(currentUser.uid).then(entries => {
        const calendar: typeof calendarData = {};
        entries.forEach(({ emoji, user, group, day, month, year }) => {
        if (!calendar[year]) calendar[year] = {};
        if (!calendar[year][month]) calendar[year][month] = {};
        if (!calendar[year][month][day]) calendar[year][month][day] = [];

        calendar[year][month][day].push({ emoji, user, group, day, month, year })
      })
      setCalendarData(calendar)
      })
    }, 1000); // Wait 1s for Firestore to sync
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

    if (!currentUser) return [];
    const user = currentUser?.uid // this will be from user on useAuth
    
    return calendarData[currentYear]?.[currentMonth]?.[currentDay]
      ?.filter(entry => entry.user === user)
      .map(entry => entry.group) || []
  }

  useEffect(() => {
    const loadCalendarData = async () => {
      if(!currentUser) return;

      setIsLoading(true)
      const entries = await fetchMoodEntries(currentUser.uid);
      const calendar: typeof calendarData = {};

      entries.forEach(({ emoji, user, group, day, month, year }) => {
        if (!calendar[year]) calendar[year] = {};
        if (!calendar[year][month]) calendar[year][month] = {};
        if (!calendar[year][month][day]) calendar[year][month][day] = [];

        calendar[year][month][day].push({ emoji, user, group, day, month, year })
      })

      setCalendarData(calendar)
      setIsLoading(false)
    }

    loadCalendarData()
  }, [currentUser])

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
          /* console.log(mockCalendarData) */
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
        loadingData={isLoading} 
        onMoodSelect={handleMoodSelect}
        calendarData={calendarData}
      />
    </div>
  )
}
