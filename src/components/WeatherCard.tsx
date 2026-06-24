import type { WeatherData } from '../hooks/useWeather'
import { getWeatherEmoji } from '../hooks/useWeather'

interface Props {
  data: WeatherData
  role: 'departure' | 'arrival'
}

function PrecipBar({ prob }: { prob: number }) {
  const level = Math.round(prob / 10)
  const color =
    prob >= 70 ? 'bg-blue-400' :
    prob >= 40 ? 'bg-blue-300/80' :
    'bg-white/20'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-col-reverse gap-px" style={{ height: 32 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 rounded-sm transition-all ${i < level ? color : 'bg-white/8'}`}
            style={{ height: 2.5 }}
          />
        ))}
      </div>
    </div>
  )
}

export function WeatherCard({ data, role }: Props) {
  const emoji = getWeatherEmoji(data.weatherCode)
  const roleLabel = role === 'departure' ? 'Départ matin' : 'Arrivée / retour'

  return (
    <div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl flex flex-col gap-4"
      style={{ padding: '28px 32px', minWidth: '340px' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-white/40 text-xs font-medium tracking-widest uppercase mb-1">
            {roleLabel}
          </div>
          <div className="text-white font-semibold text-2xl">{data.city}</div>
        </div>
        <span style={{ fontSize: '2.2rem' }}>{emoji}</span>
      </div>

      {/* Current temperature */}
      <div className="flex items-end gap-3">
        <span className="text-white font-light leading-none" style={{ fontSize: '4.5rem' }}>
          {data.temperature}°
        </span>
        <div className="flex flex-col mb-3 text-white/50 text-sm">
          <span>Ressenti {data.feelsLike}°</span>
          <span>{data.description}</span>
        </div>
      </div>

      {/* Wind + humidity */}
      <div className="flex gap-3 text-white/35 text-sm">
        <span>💨 {data.windSpeed} km/h</span>
        <span>·</span>
        <span>💧 {data.humidity}%</span>
        {data.precipitationSum > 0 && (
          <>
            <span>·</span>
            <span>🌧 {data.precipitationSum.toFixed(1)} mm</span>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Hourly precipitation */}
      <div className="flex flex-col gap-2">
        <div className="text-white/35 text-xs tracking-wider uppercase">Précipitations</div>
        <div className="flex items-end gap-4">
          {data.hourlySlots.map((slot) => (
            <div key={slot.hour} className="flex flex-col items-center gap-1">
              <span className="text-white/50 text-xs">{slot.precipProb}%</span>
              <PrecipBar prob={slot.precipProb} />
              <span className="text-white/30 text-xs">{slot.hour}h</span>
            </div>
          ))}

          {/* Umbrella indicator */}
          <div className="ml-auto flex flex-col items-center gap-1">
            {data.needsUmbrella ? (
              <>
                <span style={{ fontSize: '1.8rem' }}>☂️</span>
                <span className="text-blue-300 text-xs font-medium">Prévoir</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.8rem' }} className="opacity-30">☂️</span>
                <span className="text-white/25 text-xs">Pas besoin</span>
              </>
            )}
          </div>
        </div>

        {/* Risk summary */}
        <div className="text-white/30 text-xs">
          Risque max aujourd'hui : {data.precipProbMax}%
        </div>
      </div>
    </div>
  )
}
