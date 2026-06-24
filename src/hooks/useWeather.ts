import { useState, useEffect } from 'react'

export interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  weatherCode: number
  windSpeed: number
  humidity: number
  description: string
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

async function fetchWeather(city: string, lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Europe%2FParis`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  const c = data.current
  return {
    city,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    weatherCode: c.weather_code,
    windSpeed: Math.round(c.wind_speed_10m),
    humidity: c.relative_humidity_2m,
    description: WMO_CODES[c.weather_code] ?? 'Inconnu',
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
        fetchWeather('Troyes', 48.2973, 4.0744),
        fetchWeather('Paris', 48.8566, 2.3522),
      ])
      setWeather([troyes, paris])
    } catch (e) {
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
