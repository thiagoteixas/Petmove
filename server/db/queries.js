import { pool } from './client.js'

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export async function getDogById(id) {
  const [rows] = await pool.query(
    `SELECT
       d.id, d.name, d.gender, d.weight, d.height, d.size,
       TIMESTAMPDIFF(YEAR, d.birth_date, CURDATE()) AS age,
       db.observations AS breed_notes,
       GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR '\x1F') AS conditions
     FROM dog d
     JOIN dog_breed db ON d.Dog_breed_id = db.id
     LEFT JOIN treatment t ON t.dog_id = d.id
     LEFT JOIN \`conditions\` c ON c.id = t.conditions_id
     WHERE d.id = ?
     GROUP BY d.id`,
    [id]
  )

  const row = rows[0]
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    breed: row.breed_notes ?? 'Sem raça registrada',
    size: row.size,
    weight: row.weight,
    age: row.age,
    gender: row.gender,
    bodyCondition: null,
    medicalRestrictions: row.conditions ? row.conditions.split('\x1F') : [],
  }
}

export async function getTodayMetrics(dogId) {
  const [rows] = await pool.query(
    `SELECT
       date, diagnosis, total_calories,
       active_seconds,
       time_stalled
     FROM daily_insights
     WHERE dog_id = ? AND date = CURDATE()
     LIMIT 1`,
    [dogId]
  )

  const row = rows[0]
  if (!row) return null

  const activeMinutes = Math.round(row.active_seconds / 60)
  const totalMeasured = row.active_seconds + row.time_stalled

  return {
    date: row.date,
    stepsPerDay: null, // TODO: derive from collar_logs magnitude once algorithm is defined
    activeMinutes,
    caloriesBurned: Math.round(row.total_calories),
    sedentaryIndex:
      totalMeasured > 0
        ? Math.round((row.time_stalled / totalMeasured) * 100) / 100
        : 0,
    lowActivityAlert: activeMinutes < 30,
    healthScore: Math.min(100, 40 + activeMinutes),
    diagnosis: row.diagnosis,
  }
}

export async function getWeekMetrics(dogId) {
  const [rows] = await pool.query(
    `SELECT
       date,
       total_calories AS calories,
       active_seconds,
       DAYOFWEEK(date) - 1 AS weekday
     FROM daily_insights
     WHERE dog_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     ORDER BY date ASC`,
    [dogId]
  )

  return rows.map(r => {
    const activeMinutes = Math.round(r.active_seconds / 60)
    return {
      day: PT_DAYS[r.weekday],
      date: r.date,
      calories: Math.round(r.calories),
      activeMinutes,
      stepsPerDay: null,
      healthScore: Math.min(100, 40 + activeMinutes),
    }
  })
}
