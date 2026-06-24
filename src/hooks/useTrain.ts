import { useState, useEffect } from 'react'

export type TrainStatus = 'on_time' | 'delayed' | 'cancelled' | 'unknown' | 'loading'

export interface TrainInfo {
  status: TrainStatus
  departureTime: string
  expectedTime?: string
  delayMinutes?: number
  track?: string
  trainNumber?: string
  destination: string
  lastUpdated: Date
}

// SNCF Stop area ID for Troyes
const TROYES_STOP_ID = 'stop_area%3ASNCF%3A87113001'
const SNCF_API_BASE = 'https://api.sncf.com/v1/coverage/sncf'

async function fetchTrainStatus(apiKey: string): Promise<TrainInfo> {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10).replace(/-/g, '')

  const url = `${SNCF_API_BASE}/stop_areas/${TROYES_STOP_ID}/departures?from_datetime=${todayStr}T054700&count=20&data_freshness=realtime`

  // SNCF API uses HTTP Basic Auth: token as username, empty password
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${btoa(apiKey + ':')}` },
  })

  if (!res.ok) throw new Error(`SNCF API error: ${res.status}`)
  const data = await res.json()

  const departures = data.departures ?? []
  // Find the 7:47 train to Paris Est
  const target = departures.find((d: any) => {
    const time: string = d.stop_date_time?.base_departure_date_time ?? ''
    const dest: string = d.display_informations?.direction ?? ''
    return time.includes('T074700') && dest.toLowerCase().includes('paris')
  })

  if (!target) {
    return {
      status: 'unknown',
      departureTime: '07:47',
      destination: 'Paris Est',
      lastUpdated: new Date(),
    }
  }

  const info = target.display_informations
  const stopTime = target.stop_date_time
  const baseTime = stopTime.base_departure_date_time as string
  const realTime = stopTime.departure_date_time as string

  const parseTime = (t: string) => {
    const h = t.slice(9, 11)
    const m = t.slice(11, 13)
    return `${h}:${m}`
  }

  const baseDate = new Date(
    `${baseTime.slice(0, 4)}-${baseTime.slice(4, 6)}-${baseTime.slice(6, 8)}T${baseTime.slice(9, 11)}:${baseTime.slice(11, 13)}:00`
  )
  const realDate = new Date(
    `${realTime.slice(0, 4)}-${realTime.slice(4, 6)}-${realTime.slice(6, 8)}T${realTime.slice(9, 11)}:${realTime.slice(11, 13)}:00`
  )
  const delayMs = realDate.getTime() - baseDate.getTime()
  const delayMin = Math.round(delayMs / 60000)

  let status: TrainStatus = 'on_time'
  if (stopTime.data_freshness === 'realtime') {
    if (delayMin > 5) status = 'delayed'
    else status = 'on_time'
  }

  return {
    status,
    departureTime: '07:47',
    expectedTime: parseTime(realTime),
    delayMinutes: delayMin > 0 ? delayMin : undefined,
    trainNumber: info?.number,
    destination: info?.direction ?? 'Paris Est',
    lastUpdated: new Date(),
  }
}

export function useTrain(apiKey: string | undefined) {
  const [train, setTrain] = useState<TrainInfo>({
    status: 'loading',
    departureTime: '07:47',
    destination: 'Paris Est',
    lastUpdated: new Date(),
  })

  async function refresh() {
    if (!apiKey) {
      setTrain(prev => ({ ...prev, status: 'unknown', lastUpdated: new Date() }))
      return
    }
    try {
      const info = await fetchTrainStatus(apiKey)
      setTrain(info)
    } catch {
      setTrain(prev => ({ ...prev, status: 'unknown', lastUpdated: new Date() }))
    }
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [apiKey])

  return { train, refresh }
}
