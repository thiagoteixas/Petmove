import { useEffect, useState } from 'react'
import { fetchDog, fetchTodayMetrics, fetchWeekMetrics } from '../api/index'
import type { DogProfile, TodayMetrics, DayMetrics } from '../api/index'

// TODO: replace DOG_ID with value from auth context when login is implemented
const DOG_ID = 1

type PetDataState = {
  dog: DogProfile | null
  todayMetrics: TodayMetrics | null
  weekMetrics: DayMetrics[]
  loading: boolean
  error: string | null
}

export function usePetData(): PetDataState {
  const [dog, setDog] = useState<DogProfile | null>(null)
  const [todayMetrics, setTodayMetrics] = useState<TodayMetrics | null>(null)
  const [weekMetrics, setWeekMetrics] = useState<DayMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [dogData, todayData, weekData] = await Promise.all([
          fetchDog(DOG_ID),
          fetchTodayMetrics(DOG_ID),
          fetchWeekMetrics(DOG_ID),
        ])
        setDog(dogData)
        setTodayMetrics(todayData)
        setWeekMetrics(weekData ?? [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { dog, todayMetrics, weekMetrics, loading, error }
}
