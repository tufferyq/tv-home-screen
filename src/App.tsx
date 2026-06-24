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
      className="relative flex"
      style={{
        width: '1920px',
        height: '1080px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a0f1a 100%)',
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 700px at 15% 40%, rgba(99,102,241,0.05) 0%, transparent 70%)',
        }}
      />

      {/* LEFT COLUMN: Clock + Weather */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ padding: '72px 64px', flex: '1 1 auto' }}
      >
        <Clock />

        <div className="flex gap-6 items-end">
          {weatherLoading && (
            <div className="text-white/30 text-xl">Chargement météo…</div>
          )}
          {weatherError && (
            <div className="text-red-400/70 text-xl">{weatherError}</div>
          )}
          {weather.map((w, i) => (
            <WeatherCard key={w.city} data={w} role={i === 0 ? 'departure' : 'arrival'} />
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Train */}
      <div
        className="relative z-10 flex flex-col justify-center items-end"
        style={{ padding: '72px 72px 72px 0', flexShrink: 0 }}
      >
        <TrainCard train={train} onRefresh={refreshTrain} />
      </div>
    </div>
  )
}
