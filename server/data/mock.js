// ---------------------------------------------------------------------------
// Mock data — mirrors what the real DB queries will return.
// When connecting to real DB, delete these functions and uncomment the SQL
// in server/db/queries.js. No changes needed outside that file.
// ---------------------------------------------------------------------------

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export function mockDog(_id) {
  return {
    id: Number(_id),
    name: 'Thor',
    breed: 'Golden Retriever',
    size: 'Grande',
    weight: 32.5,
    age: 4,
    gender: 'Macho',
    bodyCondition: null,            // set a string to test the optional field UI
    medicalRestrictions: [],        // add strings to test medical tags UI
  }
}

export function mockTodayMetrics(_dogId) {
  return {
    date: new Date().toISOString().split('T')[0],
    stepsPerDay: 8420,              // null until derived from collar_logs
    activeMinutes: 96,              // daily_insights.active_seconds ÷ 60
    caloriesBurned: 1248,           // daily_insights.total_calories
    sedentaryIndex: 0.32,           // time_stalled / (active_seconds + time_stalled)
    lowActivityAlert: false,        // activeMinutes < 30
    healthScore: 87,                // computed score (0–100)
    diagnosis: 'Saudavel',          // daily_insights.diagnosis
  }
}

export function mockWeekMetrics(_dogId) {
  const base = [
    { calories: 980,  activeMinutes: 62,  stepsPerDay: 6200  },
    { calories: 1130, activeMinutes: 74,  stepsPerDay: 7400  },
    { calories: 1040, activeMinutes: 69,  stepsPerDay: 6900  },
    { calories: 1210, activeMinutes: 82,  stepsPerDay: 8200  },
    { calories: 1195, activeMinutes: 88,  stepsPerDay: 8800  },
    { calories: 1375, activeMinutes: 102, stepsPerDay: 10200 },
    { calories: 1248, activeMinutes: 96,  stepsPerDay: 8420  },
  ]

  const today = new Date()
  return base.map((d, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - i))
    return {
      ...d,
      day: PT_DAYS[date.getDay()],
      date: date.toISOString().split('T')[0],
      healthScore: Math.min(100, 40 + Math.round(d.activeMinutes / 1.5)),
    }
  })
}
