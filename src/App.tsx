import { Clock } from './components/Clock'
import { WeatherCard } from './components/WeatherCard'
import { TrainCard } from './components/TrainCard'
import { useWeather } from './hooks/useWeather'
import { useTrain } from './hooks/useTrain'
import './index.css'

const SNCF_API_KEY = import.meta.env.VITE_SNCF_API_KEY as string | undefined

export default function App() {
  const { weather, loading: weatherLoading, error: weatherError } = useWeather()
  const { train, refresh: refreshTrain } = useTrain(SNCF_API_KEY)

  return (
    <div
      className="relative flex flex-col justify-between"
      style={{
        width: '1920px',
        height: '1080px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a0f1a 100%)',
        padding: '80px 100px',
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 20% 30%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      {/* TOP ROW: Clock + Train */}
      <div className="flex items-start justify-between relative z-10">
        <Clock />
        <TrainCard train={train} onRefresh={refreshTrain} />
      </div>

      {/* BOTTOM ROW: Weather */}
      <div className="flex items-end justify-between relative z-10">
        <div className="flex gap-6">
          {weatherLoading && (
            <div className="text-white/30 text-xl">Chargement météo…</div>
          )}
          {weatherError && (
            <div className="text-red-400/70 text-xl">{weatherError}</div>
          )}
          {weather.map((w) => (
            <WeatherCard key={w.city} data={w} />
          ))}
        </div>

        <div className="text-white/10 text-base tracking-widest uppercase text-right">
          <div>Fluo Grand Est</div>
          <div className="text-white/5 text-sm">Troyes — Paris Est · 07:47</div>
        </div>
      </div>
    </div>
  )
}
