import type { WeatherData } from '../hooks/useWeather'
import { getWeatherEmoji } from '../hooks/useWeather'

interface Props {
  data: WeatherData
}

export function WeatherCard({ data }: Props) {
  const emoji = getWeatherEmoji(data.weatherCode)

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col gap-3 min-w-72">
      <div className="flex items-center justify-between">
        <span className="text-white/60 font-medium tracking-widest uppercase text-sm">
          {data.city}
        </span>
        <span style={{ fontSize: '2rem' }}>{emoji}</span>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-white font-light leading-none" style={{ fontSize: '5rem' }}>
          {data.temperature}°
        </span>
      </div>

      <div className="text-white/70 text-lg">{data.description}</div>

      <div className="flex gap-4 text-white/40 text-sm mt-1">
        <span>Ressenti {data.feelsLike}°</span>
        <span>·</span>
        <span>Vent {data.windSpeed} km/h</span>
        <span>·</span>
        <span>Humidité {data.humidity}%</span>
      </div>
    </div>
  )
}
