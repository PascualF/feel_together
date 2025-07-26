type MoodEntry = {
  emoji: string;
  user: string;
  group: string;
}

const mockCalendarData: { 
  [year: number]: {
    [month: number]: {
      [day: number]: MoodEntry[]
    }
  }
  } = {
    2025: {
      6: { // index of july
        1: [{emoji: '😊', user: 'Pascual', group: 'Default' }],
        2: [{emoji: '😊', user: 'Janine',  group: 'Default' }, 
          {emoji: '😬', user: 'Bob', group: 'Default' }
        ],
        5: [
          {emoji: '😔', user: 'Pascual', group: 'Default'}, 
          {emoji: '😠', user: 'Janine', group: 'Default'}, 
          {emoji: '😭', user: 'Kelly', group: 'Default'}
        ],
      },
      5: {
        10: [{emoji: '💩', user: 'Pascual', group: 'Default'}],
        14: [{emoji: '🥵', user: 'Janine', group: 'Default'}, {emoji: '😊', user: 'Pascual', group: 'Default'}],
        }
    }
};

export default mockCalendarData;