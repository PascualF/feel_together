'use client'

import React, {useEffect, useState} from 'react'

interface MoodModalProps{
    isOpen: boolean;
    mood: { 
        emoji: string, 
        group: string
    } | null; //allowing null in here
    groups: string[];
    groupsWithMoodToday: string[];
    onCancel: () => void;
    onConfirm: (groupName: string[]) => void;
}

export default function MoodModal({
        isOpen, 
        mood,
        groups,
        groupsWithMoodToday, 
        onCancel, 
        onConfirm
    } : MoodModalProps) {

    const [ selectedGroups, setSelectedGoups ] = useState<string[]>([])


    useEffect(() => {
        // Will only show groups that haven't been choosed today, auto-select all.
        const availableGroups = groups.filter((group) => !groupsWithMoodToday.includes(group))
        setSelectedGoups(availableGroups)
    }, [groups, groupsWithMoodToday])
    
    if(!isOpen) return null

    const availableGroups = groups.filter((group) => !groupsWithMoodToday.includes(group))

    if (availableGroups.length === 0) {
        return (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white p-6 ronded-lg shadow-lg w-96 text-center'>
                    <p className='text-xl font-semibold mb-4'>
                        Mood already selected for all groups today!
                    </p>
                    <button 
                        onClick={onCancel} 
                        className='px-4 py-2 bg-blue-500 text-white rounded'
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    }

    const toggleGroup = (group: string) => {
        setSelectedGoups((prev) =>
            prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
        )
    }

    if (!mood) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-60 sm:w-96'>
                <h2>{"You're really feeling "}{mood.emoji}</h2>

                <p className='mb-2 font-semibold'>Select groups:</p>
                <div className='max-h-40 overflow-y-auto mb-4'>
                    {groups.map((group) => {
                        const disabled = groupsWithMoodToday.includes(group);
                        const checked = selectedGroups.includes(group);
                        return(
                            <label key={group} className={`flex items-center mb-2 ${disabled ? "text-gray-400" : ""}`}>
                                <input
                                    type="checkbox"
                                    disabled={disabled}
                                    checked={checked}
                                    onChange={() => toggleGroup(group)}
                                    className='mr-2'
                                />
                                {group}
                            </label>
                        )
                    })}
                </div>

                <div>
                    <button onClick={onCancel} className='px-4 py-2 bg-gray-300 rounded'>
                        Cancel
                    </button>
                    <button 
                        onClick={ () => onConfirm(selectedGroups)} 
                        className='px-4 py-2 bg-blue-500 text-white rounded'
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
