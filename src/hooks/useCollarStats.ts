import { useEffect, useState } from 'react'

export type StateDistributionItem = {
  state: string
  count: number
}

export type CollarStats = {
  stateDistribution: StateDistributionItem[]
  total: number
  avgBattery: number
  minBattery: number
  lastSeen: string | null
}

export function useCollarStats(collarId: number) {
  const [stats, setStats] = useState<CollarStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/collars/${collarId}/stats`)
      .then(r => (r.ok ? r.json() : null))
      .then((data: CollarStats | null) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [collarId])

  return { stats, loading }
}
