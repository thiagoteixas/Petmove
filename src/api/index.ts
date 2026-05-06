const BASE = '/api'

// ---------------------------------------------------------------------------
// Types — mirror the shape returned by server/db/queries.js
// When connecting to real DB, only the server/db/ files need to change;
// these types and fetch functions stay the same.
// ---------------------------------------------------------------------------

export type DogProfile = {
  id: number
  name: string
  breed: string
  size: 'Pequeno' | 'Médio' | 'Grande'
  weight: number                  // kg
  age: number                     // years, derived from birth_date
  gender: string                  // 'Macho' | 'Fêmea' | 'Não Informado'
  bodyCondition: string | null    // condição corporal (optional)
  medicalRestrictions: string[]   // restrições médicas (from conditions table)
}

export type TodayMetrics = {
  date: string
  stepsPerDay: number | null      // passos/dia — derived from collar_logs (null until implemented)
  activeMinutes: number           // tempo ativo — from daily_insights.active_seconds ÷ 60
  caloriesBurned: number          // calorias gastas — from daily_insights.total_calories
  sedentaryIndex: number          // índice de sedentarismo — time_stalled / total time (0–1)
  lowActivityAlert: boolean       // alerta de pouca atividade — activeMinutes < 30
  healthScore: number             // score de saúde (0–100)
  diagnosis: string               // from daily_insights.diagnosis
}

export type DayMetrics = {
  day: string                     // short day label, e.g. 'Seg'
  date: string                    // ISO date
  calories: number
  activeMinutes: number
  stepsPerDay: number | null
  healthScore: number
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Erro ao buscar dados (${res.status})`)
  return res.json() as Promise<T>
}

export const fetchDog = (id: number) =>
  apiFetch<DogProfile>(`/dogs/${id}`)

export const fetchTodayMetrics = (dogId: number) =>
  apiFetch<TodayMetrics>(`/dogs/${dogId}/metrics/today`)

export const fetchWeekMetrics = (dogId: number) =>
  apiFetch<DayMetrics[]>(`/dogs/${dogId}/metrics/week`)
