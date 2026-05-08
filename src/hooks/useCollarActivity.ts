import { useEffect, useState } from 'react'

export type HourlyActivity = {
  time: string    // 'HH:MM' — início do bucket de 5 min
  active: number
  resting: number
  total: number
}

export function useCollarActivity(collarId: number) {
  const [data, setData] = useState<HourlyActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/collars/${collarId}/activity`)
      .then(r => (r.ok ? r.json() : []))
      .then((rows: HourlyActivity[]) => {
        setData(rows)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [collarId])

  return { data, loading }
}
