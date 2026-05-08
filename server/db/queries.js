import { pool } from './client.js'

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

// Ana's formula constants: E = weight × c_state × time(min)
const ACTIVITY_COST = {
  'Andando': 0.10,
  'Correndo': 0.20,
  'Pulando': 0.15,
  'Parado/Descansando': 0,
}

function ageGroup(ageYears, avgWeight) {
  if (avgWeight > 25) return ageYears < 1 ? 'filhote' : ageYears < 6 ? 'adulto' : 'idoso'
  if (avgWeight > 10) return ageYears < 1 ? 'filhote' : ageYears < 8 ? 'adulto' : 'idoso'
  return ageYears < 1 ? 'filhote' : ageYears < 10 ? 'adulto' : 'idoso'
}

function idealExerciseMinutes(avgWeight) {
  if (avgWeight > 25) return 60
  if (avgWeight > 10) return 45
  return 30
}

// ── USER ──────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, username, email, phone, age, is_admin, created_at FROM user ORDER BY id'
  )
  return rows
}

export async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, email, phone, age, is_admin, created_at FROM user WHERE id = ?',
    [id]
  )
  return rows[0] ?? null
}

export async function createUser({ username, email, password, phone, age }) {
  const [result] = await pool.query(
    'INSERT INTO user (username, email, password, phone, age) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, phone ?? '(00)000000000', age ?? 0]
  )
  return result.insertId
}

export async function updateUser(id, { username, email, phone, age }) {
  const [result] = await pool.query(
    `UPDATE user SET
       username = COALESCE(?, username),
       email    = COALESCE(?, email),
       phone    = COALESCE(?, phone),
       age      = COALESCE(?, age)
     WHERE id = ?`,
    [username ?? null, email ?? null, phone ?? null, age ?? null, id]
  )
  return result.affectedRows
}

export async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM user WHERE id = ?', [id])
  return result.affectedRows
}

// ── COLLAR ────────────────────────────────────────────────────────────────────

export async function getAllCollars() {
  const [rows] = await pool.query(
    `SELECT c.id, c.user_id, u.username, c.date_of_purchase
     FROM collar c JOIN user u ON u.id = c.user_id
     ORDER BY c.id`
  )
  return rows
}

export async function getCollarById(id) {
  const [rows] = await pool.query(
    `SELECT c.id, c.user_id, u.username, c.date_of_purchase
     FROM collar c JOIN user u ON u.id = c.user_id
     WHERE c.id = ?`,
    [id]
  )
  return rows[0] ?? null
}

export async function createCollar({ user_id, date_of_purchase }) {
  const [result] = await pool.query(
    'INSERT INTO collar (user_id, date_of_purchase) VALUES (?, ?)',
    [user_id, date_of_purchase ?? null]
  )
  return result.insertId
}

export async function updateCollar(id, { date_of_purchase }) {
  const [result] = await pool.query(
    'UPDATE collar SET date_of_purchase = COALESCE(?, date_of_purchase) WHERE id = ?',
    [date_of_purchase ?? null, id]
  )
  return result.affectedRows
}

export async function deleteCollar(id) {
  const [result] = await pool.query('DELETE FROM collar WHERE id = ?', [id])
  return result.affectedRows
}

// ── COLLAR_LOGS ───────────────────────────────────────────────────────────────

export async function getAllCollarLogs({ collar_id, limit = 100 }) {
  const safeLimit = Math.min(Number(limit), 500)
  if (collar_id) {
    const [rows] = await pool.query(
      `SELECT id, collar_id, state, magnitude, x_axis, y_axis, z_axis, battery, created_at
       FROM collar_logs WHERE collar_id = ? ORDER BY created_at DESC LIMIT ?`,
      [collar_id, safeLimit]
    )
    return rows
  }
  const [rows] = await pool.query(
    `SELECT id, collar_id, state, magnitude, x_axis, y_axis, z_axis, battery, created_at
     FROM collar_logs ORDER BY created_at DESC LIMIT ?`,
    [safeLimit]
  )
  return rows
}

export async function getCollarLogById(id) {
  const [rows] = await pool.query(
    'SELECT id, collar_id, state, magnitude, x_axis, y_axis, z_axis, battery, created_at FROM collar_logs WHERE id = ?',
    [id]
  )
  return rows[0] ?? null
}

export async function createCollarLog({ collar_id, state, magnitude, x_axis, y_axis, z_axis, battery }) {
  const [result] = await pool.query(
    'INSERT INTO collar_logs (collar_id, state, magnitude, x_axis, y_axis, z_axis, battery) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [collar_id, state ?? 'Parado', magnitude ?? null, x_axis ?? null, y_axis ?? null, z_axis ?? null, battery ?? 100]
  )
  return result.insertId
}

export async function updateCollarLog(id, { state, magnitude, x_axis, y_axis, z_axis, battery }) {
  const [result] = await pool.query(
    `UPDATE collar_logs SET
       state     = COALESCE(?, state),
       magnitude = COALESCE(?, magnitude),
       x_axis    = COALESCE(?, x_axis),
       y_axis    = COALESCE(?, y_axis),
       z_axis    = COALESCE(?, z_axis),
       battery   = COALESCE(?, battery)
     WHERE id = ?`,
    [state ?? null, magnitude ?? null, x_axis ?? null, y_axis ?? null, z_axis ?? null, battery ?? null, id]
  )
  return result.affectedRows
}

export async function deleteCollarLog(id) {
  const [result] = await pool.query('DELETE FROM collar_logs WHERE id = ?', [id])
  return result.affectedRows
}

// ── CONDITIONS ────────────────────────────────────────────────────────────────

export async function getAllConditions() {
  const [rows] = await pool.query(
    'SELECT id, name, synptoms FROM `conditions` ORDER BY name'
  )
  return rows
}

export async function getConditionById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, synptoms FROM `conditions` WHERE id = ?',
    [id]
  )
  return rows[0] ?? null
}

export async function createCondition({ name, synptoms }) {
  const [result] = await pool.query(
    'INSERT INTO `conditions` (name, synptoms) VALUES (?, ?)',
    [name, synptoms ?? null]
  )
  return result.insertId
}

export async function updateCondition(id, { name, synptoms }) {
  const [result] = await pool.query(
    `UPDATE \`conditions\` SET
       name     = COALESCE(?, name),
       synptoms = COALESCE(?, synptoms)
     WHERE id = ?`,
    [name ?? null, synptoms ?? null, id]
  )
  return result.affectedRows
}

export async function deleteCondition(id) {
  const [result] = await pool.query('DELETE FROM `conditions` WHERE id = ?', [id])
  return result.affectedRows
}

// ── DOG_BREED ─────────────────────────────────────────────────────────────────

export async function getAllBreeds() {
  const [rows] = await pool.query(
    'SELECT id, avg_heigth, avg_weigth, life_expectancy, constant, observations FROM dog_breed ORDER BY id'
  )
  return rows.map(enrichBreed)
}

export async function getBreedById(id) {
  const [rows] = await pool.query(
    'SELECT id, avg_heigth, avg_weigth, life_expectancy, constant, observations FROM dog_breed WHERE id = ?',
    [id]
  )
  return rows[0] ? enrichBreed(rows[0]) : null
}

function enrichBreed(row) {
  const w = row.avg_weigth
  return {
    id: row.id,
    observations: row.observations,
    avgHeight: row.avg_heigth,
    avgWeight: w,
    lifeExpectancy: row.life_expectancy,
    constant: row.constant,
    idealExerciseMinutes: idealExerciseMinutes(w),
    healthyWeightRange: {
      min: Math.round(w * 0.85 * 10) / 10,
      max: Math.round(w * 1.15 * 10) / 10,
    },
    basalEnergyKcal: Math.round(w * row.constant * 1440),
    obesityPredisposition: row.constant < 0.05 ? 'alta' : row.constant < 0.10 ? 'média' : 'baixa',
    ageGroups: {
      filhote: '0–1 ano',
      adulto: w > 25 ? '1–6 anos' : w > 10 ? '1–8 anos' : '1–10 anos',
      idoso:  w > 25 ? '6+ anos'  : w > 10 ? '8+ anos'  : '10+ anos',
    },
  }
}

export async function createBreed({ avg_heigth, avg_weigth, life_expectancy, constant, observations }) {
  const [result] = await pool.query(
    'INSERT INTO dog_breed (avg_heigth, avg_weigth, life_expectancy, constant, observations) VALUES (?, ?, ?, ?, ?)',
    [avg_heigth ?? 0, avg_weigth ?? 0, life_expectancy ?? 0, constant ?? 0, observations ?? null]
  )
  return result.insertId
}

export async function updateBreed(id, { avg_heigth, avg_weigth, life_expectancy, constant, observations }) {
  const [result] = await pool.query(
    `UPDATE dog_breed SET
       avg_heigth      = COALESCE(?, avg_heigth),
       avg_weigth      = COALESCE(?, avg_weigth),
       life_expectancy = COALESCE(?, life_expectancy),
       constant        = COALESCE(?, constant),
       observations    = COALESCE(?, observations)
     WHERE id = ?`,
    [avg_heigth ?? null, avg_weigth ?? null, life_expectancy ?? null, constant ?? null, observations ?? null, id]
  )
  return result.affectedRows
}

export async function deleteBreed(id) {
  const [result] = await pool.query('DELETE FROM dog_breed WHERE id = ?', [id])
  return result.affectedRows
}

// ── DOG ───────────────────────────────────────────────────────────────────────

export async function getAllDogs() {
  const [rows] = await pool.query(
    `SELECT d.id, d.name, d.gender, d.weight, d.height, d.size,
            TIMESTAMPDIFF(YEAR, d.birth_date, CURDATE()) AS age,
            d.user_id, d.Dog_breed_id AS breed_id, d.collar_id,
            db.observations AS breed, db.avg_weigth
     FROM dog d JOIN dog_breed db ON db.id = d.Dog_breed_id
     ORDER BY d.id`
  )
  return rows.map(r => ({ ...r, ageGroup: ageGroup(r.age, r.avg_weigth), avg_weigth: undefined }))
}

export async function getDogById(id) {
  const [rows] = await pool.query(
    `SELECT
       d.id, d.name, d.gender, d.weight, d.height, d.size,
       TIMESTAMPDIFF(YEAR, d.birth_date, CURDATE()) AS age,
       db.avg_weigth, db.constant AS breed_constant, db.observations AS breed_name,
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
    breed: row.breed_name ?? 'Sem raça registrada',
    size: row.size,
    weight: row.weight,
    age: row.age,
    gender: row.gender,
    ageGroup: ageGroup(row.age, row.avg_weigth),
    bodyCondition: null,
    medicalRestrictions: row.conditions ? row.conditions.split('\x1F') : [],
  }
}

export async function createDog({ name, gender, weight, height, size, user_id, Dog_breed_id, collar_id, birth_date }) {
  const [result] = await pool.query(
    'INSERT INTO dog (name, gender, weight, height, size, user_id, Dog_breed_id, collar_id, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, gender ?? 'Nao Informado', weight, height, size ?? 'Medio', user_id, Dog_breed_id, collar_id, birth_date ?? null]
  )
  return result.insertId
}

export async function updateDog(id, { name, gender, weight, height, size, birth_date }) {
  const [result] = await pool.query(
    `UPDATE dog SET
       name       = COALESCE(?, name),
       gender     = COALESCE(?, gender),
       weight     = COALESCE(?, weight),
       height     = COALESCE(?, height),
       size       = COALESCE(?, size),
       birth_date = COALESCE(?, birth_date)
     WHERE id = ?`,
    [name ?? null, gender ?? null, weight ?? null, height ?? null, size ?? null, birth_date ?? null, id]
  )
  return result.affectedRows
}

export async function deleteDog(id) {
  const [result] = await pool.query('DELETE FROM dog WHERE id = ?', [id])
  return result.affectedRows
}

// ── TREATMENT ─────────────────────────────────────────────────────────────────

export async function getAllTreatments({ dog_id } = {}) {
  if (dog_id) {
    const [rows] = await pool.query(
      `SELECT t.id, t.dog_id, d.name AS dog_name, t.conditions_id,
              c.name AS condition_name, c.synptoms, t.actions
       FROM treatment t
       JOIN dog d ON d.id = t.dog_id
       JOIN \`conditions\` c ON c.id = t.conditions_id
       WHERE t.dog_id = ? ORDER BY c.name`,
      [dog_id]
    )
    return rows
  }
  const [rows] = await pool.query(
    `SELECT t.id, t.dog_id, d.name AS dog_name, t.conditions_id,
            c.name AS condition_name, c.synptoms, t.actions
     FROM treatment t
     JOIN dog d ON d.id = t.dog_id
     JOIN \`conditions\` c ON c.id = t.conditions_id
     ORDER BY d.name, c.name`
  )
  return rows
}

export async function getTreatmentById(id) {
  const [rows] = await pool.query(
    `SELECT t.id, t.dog_id, d.name AS dog_name, t.conditions_id,
            c.name AS condition_name, c.synptoms, t.actions
     FROM treatment t
     JOIN dog d ON d.id = t.dog_id
     JOIN \`conditions\` c ON c.id = t.conditions_id
     WHERE t.id = ?`,
    [id]
  )
  return rows[0] ?? null
}

export async function createTreatment({ dog_id, conditions_id, actions }) {
  const [result] = await pool.query(
    'INSERT INTO treatment (dog_id, conditions_id, actions) VALUES (?, ?, ?)',
    [dog_id, conditions_id, actions ?? null]
  )
  return result.insertId
}

export async function updateTreatment(id, { actions }) {
  const [result] = await pool.query(
    'UPDATE treatment SET actions = COALESCE(?, actions) WHERE id = ?',
    [actions ?? null, id]
  )
  return result.affectedRows
}

export async function deleteTreatment(id) {
  const [result] = await pool.query('DELETE FROM treatment WHERE id = ?', [id])
  return result.affectedRows
}

// ── DAILY_INSIGHTS ────────────────────────────────────────────────────────────

export async function getAllInsights({ dog_id, days = 30 } = {}) {
  const safedays = Math.min(Number(days), 365)
  if (dog_id) {
    const [rows] = await pool.query(
      `SELECT id, dog_id, date, diagnosis, total_calories,
              active_seconds, time_stalled, time_walking, time_running, time_off
       FROM daily_insights
       WHERE dog_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       ORDER BY date DESC`,
      [dog_id, safedays]
    )
    return rows
  }
  const [rows] = await pool.query(
    `SELECT id, dog_id, date, diagnosis, total_calories,
            active_seconds, time_stalled, time_walking, time_running, time_off
     FROM daily_insights
     WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
     ORDER BY date DESC`,
    [safedays]
  )
  return rows
}

export async function getInsightById(id) {
  const [rows] = await pool.query(
    `SELECT id, dog_id, date, diagnosis, total_calories,
            active_seconds, time_stalled, time_walking, time_running, time_off
     FROM daily_insights WHERE id = ?`,
    [id]
  )
  return rows[0] ?? null
}

export async function createInsight({ dog_id, date, diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off }) {
  const [result] = await pool.query(
    `INSERT INTO daily_insights
       (dog_id, date, diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [dog_id, date, diagnosis ?? 'Saudavel',
     total_calories ?? 0, active_seconds ?? 0,
     time_stalled ?? 0, time_walking ?? 0, time_running ?? 0, time_off ?? 0]
  )
  return result.insertId
}

export async function updateInsight(id, { diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off }) {
  const [result] = await pool.query(
    `UPDATE daily_insights SET
       diagnosis      = COALESCE(?, diagnosis),
       total_calories = COALESCE(?, total_calories),
       active_seconds = COALESCE(?, active_seconds),
       time_stalled   = COALESCE(?, time_stalled),
       time_walking   = COALESCE(?, time_walking),
       time_running   = COALESCE(?, time_running),
       time_off       = COALESCE(?, time_off)
     WHERE id = ?`,
    [diagnosis ?? null, total_calories ?? null, active_seconds ?? null,
     time_stalled ?? null, time_walking ?? null, time_running ?? null, time_off ?? null, id]
  )
  return result.affectedRows
}

export async function deleteInsight(id) {
  const [result] = await pool.query('DELETE FROM daily_insights WHERE id = ?', [id])
  return result.affectedRows
}

// ── COLLAR HOURLY ACTIVITY ────────────────────────────────────────────────────

export async function getCollarHourlyActivity(collarId, bucketMinutes = 5) {
  // Group by N-minute buckets using the actual created_at timestamp.
  // Uses the most recent date in the table (may not be today).
  const [rows] = await pool.query(
    `SELECT
       DATE_FORMAT(
         DATE_SUB(created_at, INTERVAL MOD(MINUTE(created_at), ?) MINUTE),
         '%H:%i'
       ) AS time_label,
       SUM(CASE WHEN state != 'Parado/Descansando' THEN 1 ELSE 0 END) AS active,
       SUM(CASE WHEN state  = 'Parado/Descansando' THEN 1 ELSE 0 END) AS resting,
       COUNT(*) AS total
     FROM collar_logs
     WHERE collar_id = ?
       AND DATE(created_at) = (
         SELECT DATE(MAX(created_at)) FROM collar_logs WHERE collar_id = ?
       )
     GROUP BY time_label
     ORDER BY time_label`,
    [bucketMinutes, collarId, collarId]
  )
  return rows.map(r => ({
    time: r.time_label,
    active: Number(r.active),
    resting: Number(r.resting),
    total: Number(r.total),
  }))
}

// ── COLLAR STATS ──────────────────────────────────────────────────────────────

export async function getCollarStats(collarId) {
  const [stateRows] = await pool.query(
    `SELECT state, COUNT(*) AS count
     FROM collar_logs WHERE collar_id = ?
     GROUP BY state ORDER BY count DESC`,
    [collarId]
  )
  const [aggRows] = await pool.query(
    `SELECT COUNT(*) AS total, ROUND(AVG(battery), 1) AS avg_battery,
            MIN(battery) AS min_battery, MAX(created_at) AS last_seen
     FROM collar_logs WHERE collar_id = ?`,
    [collarId]
  )
  const agg = aggRows[0]
  return {
    stateDistribution: stateRows.map(r => ({ state: r.state, count: Number(r.count) })),
    total: Number(agg.total),
    avgBattery: Number(agg.avg_battery),
    minBattery: Number(agg.min_battery),
    lastSeen: agg.last_seen,
  }
}

// ── COLLAR STATUS (real-time) ─────────────────────────────────────────────────

export async function getLatestDogStatus(dogId) {
  const [rows] = await pool.query(
    `SELECT cl.state, cl.battery, cl.magnitude, cl.created_at
     FROM collar_logs cl
     JOIN dog d ON d.collar_id = cl.collar_id
     WHERE d.id = ?
     ORDER BY cl.created_at DESC
     LIMIT 1`,
    [dogId]
  )
  return rows[0] ?? null
}

// ── METRICS (derived from daily_insights + collar_logs fallback) ───────────────

export async function getTodayMetrics(dogId) {
  const [insightRows] = await pool.query(
    `SELECT date, diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running
     FROM daily_insights
     WHERE dog_id = ?
     ORDER BY date DESC
     LIMIT 1`,
    [dogId]
  )
  if (insightRows[0]) return buildTodayResponse(insightRows[0])

  // Fallback: real-time from collar_logs. Each log ≈ 1 sample, treated as 1 min interval.
  const [logRows] = await pool.query(
    `SELECT d.weight, db.constant AS breed_constant,
            SUM(CASE WHEN cl.state = 'Andando'           THEN 1 ELSE 0 END) AS walking_logs,
            SUM(CASE WHEN cl.state = 'Correndo'           THEN 1 ELSE 0 END) AS running_logs,
            SUM(CASE WHEN cl.state = 'Pulando'            THEN 1 ELSE 0 END) AS jumping_logs,
            SUM(CASE WHEN cl.state = 'Parado/Descansando' THEN 1 ELSE 0 END) AS stalled_logs,
            COUNT(*) AS total_logs
     FROM collar_logs cl
     JOIN dog d ON d.collar_id = cl.collar_id
     JOIN dog_breed db ON db.id = d.Dog_breed_id
     WHERE d.id = ? AND DATE(cl.created_at) = CURDATE()
     GROUP BY d.weight, db.constant`,
    [dogId]
  )
  if (!logRows[0] || logRows[0].total_logs === 0) return null

  const r = logRows[0]
  const calories = Math.round(
    (r.walking_logs * ACTIVITY_COST['Andando'] +
     r.running_logs * ACTIVITY_COST['Correndo'] +
     r.jumping_logs * ACTIVITY_COST['Pulando']) * r.weight * r.breed_constant
  )
  return buildTodayResponse({
    date: new Date(),
    diagnosis: 'tempo real',
    total_calories: calories,
    active_seconds: (r.walking_logs + r.running_logs + r.jumping_logs) * 60,
    time_stalled: r.stalled_logs * 60,
    time_walking: r.walking_logs * 60,
    time_running: r.running_logs * 60,
    _realtime: true,
  })
}

function buildTodayResponse(row) {
  const activeMinutes = Math.round(row.active_seconds / 60)
  const totalMeasured = row.active_seconds + row.time_stalled
  return {
    date: row.date,
    stepsPerDay: null,
    activeMinutes,
    caloriesBurned: Math.round(row.total_calories),
    sedentaryIndex: totalMeasured > 0
      ? Math.round((row.time_stalled / totalMeasured) * 100) / 100
      : 0,
    lowActivityAlert: activeMinutes < 30,
    healthScore: Math.min(100, 40 + activeMinutes),
    diagnosis: row.diagnosis,
    realtime: !!row._realtime,
  }
}

export async function getWeekMetrics(dogId) {
  const [rows] = await pool.query(
    `SELECT date, total_calories AS calories, active_seconds, DAYOFWEEK(date) - 1 AS weekday
     FROM daily_insights
     WHERE dog_id = ?
       AND date >= DATE_SUB(
         (SELECT MAX(date) FROM daily_insights WHERE dog_id = ?),
         INTERVAL 6 DAY
       )
     ORDER BY date ASC`,
    [dogId, dogId]
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
