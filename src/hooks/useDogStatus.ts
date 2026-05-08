import { useEffect, useState } from 'react'
import type { DogStatus } from '../api/index'

type DogStatusState = {
  status: DogStatus | null
  connected: boolean
}

export function useDogStatus(dogId: number): DogStatusState {
  const [status, setStatus] = useState<DogStatus | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const es = new EventSource(`/api/dogs/${dogId}/status/stream`)

    es.onopen = () => setConnected(true)

    es.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as DogStatus | null
      setStatus(data)
      setConnected(true)
    }

    es.onerror = () => {
      setConnected(false)
      es.close()
    }

    return () => {
      es.close()
    }
  }, [dogId])

  return { status, connected }
}
