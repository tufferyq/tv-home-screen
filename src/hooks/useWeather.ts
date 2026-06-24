import { useState, useEffect } from 'react'

export interface HourlySlot {
  hour: number
  precipProb: number
  temp: number
}

export interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  weatherCode: number
  windSpeed: number
  humidity: number
  description: string
  precipitationSum: number
  precipProbMax: number
  needsUmbrella: boolean
  hourlySlots: HourlySlot[]
}

const WMO_CODES: Record<number, string> = {
  0: 'Ciel dégagé',
  1: 'Peu nuageux',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  61: 'Pluie légère',
  63: 'Pluie modérée',
  65: 'Pluie forte',
  71: 'Neige légère',
  73: 'Neige modérée',
  75: 'Neige forte',
  80: 'Averses légères',
  81: 'Averses',
  82: 'Averses violentes',
  95: 'Orage',
  96: 'Orage avec grêle',
  99: 'Orage violent',
}

export function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 55) return '🌦️'
  if (code <= 65) return '🌧️'
  if (code <= 75) return '🌨️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

// Heures clés à afficher selon la ville
const TROYES_HOURS = [7, 9, 12, 15, 18]   // départ tôt le matin
const PARIS_HOURS  = [9, 12, 15, 18, 20]  // arrivée + retour soir

async function fetchWeather(city: string, lat: number, lon: number, relevantHours: number[]): Promise<WeatherData> {
  const url = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${lat}&longitude=${lon}`,
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`,
    `&hourly=precipitation_probability,temperature_2m`,
    `&daily=precipitation_sum,precipitation_probability_max`,
    `&timezone=Europe%2FParis`,
    `&forecast_days=1`,
  ].join('')

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()

  const c = data.current
  const daily = data.daily
  const hourlyProb: number[] = data.hourly.precipitation_probability
  const hourlyTemp: number[] = data.hourly.temperature_2m

  const precipProbMax: number = daily.precipitation_probability_max[0] ?? 0
  const precipitationSum: number = daily.precipitation_sum[0] ?? 0

  const hourlySlots: HourlySlot[] = relevantHours.map((hour) => ({
    hour,
    precipProb: hourlyProb[hour] ?? 0,
    temp: Math.round(hourlyTemp[hour] ?? 0),
  }))

  return {
    city,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    weatherCode: c.weather_code,
    windSpeed: Math.round(c.wind_speed_10m),
    humidity: c.relative_humidity_2m,
    description: WMO_CODES[c.weather_code] ?? 'Inconnu',
    precipitationSum,
    precipProbMax,
    needsUmbrella: precipProbMax >= 40 || precipitationSum > 1,
    hourlySlots,
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      setError(null)
      const [troyes, paris] = await Promise.all([
        fetchWeather('Troyes', 48.2973, 4.0744, TROYES_HOURS),
        fetchWeather('Paris', 48.8566, 2.3522, PARIS_HOURS),
      ])
      setWeather([troyes, paris])
    } catch {
      setError('Météo indisponible')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { weather, loading, error }
}
