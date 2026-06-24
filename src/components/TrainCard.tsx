import type { TrainInfo, TrainStatus } from '../hooks/useTrain'
import { useClock } from '../hooks/useClock'
import { TerLogo } from './TerLogo'

interface Props {
  train: TrainInfo
  onRefresh: () => void
}

const STATUS_CONFIG: Record<TrainStatus, { label: string; color: string; bg: string; dot: string }> = {
  on_time: {
    label: "À l'heure",
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/25',
    dot: 'bg-emerald-400',
  },
  delayed: {
    label: 'Retard',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/25',
    dot: 'bg-amber-400',
  },
  cancelled: {
    label: 'Supprimé',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/25',
    dot: 'bg-red-400',
  },
  unknown: {
    label: 'Indisponible',
    color: 'text-white/40',
    bg: 'bg-white/5 border-white/10',
    dot: 'bg-white/20',
  },
  loading: {
    label: 'Chargement…',
    color: 'text-white/40',
    bg: 'bg-white/5 border-white/10',
    dot: 'bg-white/20',
  },
}

export function TrainCard({ train, onRefresh }: Props) {
  const now = useClock()
  const cfg = STATUS_CONFIG[train.status]

  const minutesUntil = (() => {
    const [h, m] = train.departureTime.split(':').map(Number)
    const dep = new Date(now)
    dep.setHours(h, m, 0, 0)
    return Math.round((dep.getTime() - now.getTime()) / 60000)
  })()

  const countdownLabel =
    minutesUntil > 0 && minutesUntil < 480
      ? `dans ${minutesUntil} min`
      : minutesUntil <= 0
      ? 'déjà parti'
      : 'demain matin'

  const lastUpdatedStr = `${String(train.lastUpdated.getHours()).padStart(2, '0')}:${String(train.lastUpdated.getMinutes()).padStart(2, '0')}`

  const displayTime =
    train.status === 'delayed' && train.expectedTime
      ? train.expectedTime
      : train.departureTime

  return (
    <div
      className={`border rounded-3xl flex flex-col gap-5 ${cfg.bg}`}
      style={{ padding: '28px 32px', minWidth: '400px' }}
    >
      {/* Header: logo + refresh */}
      <div className="flex items-center justify-between">
        <TerLogo size={48} />
        <button
          onClick={onRefresh}
          className="text-white/20 hover:text-white/60 transition-colors text-xl leading-none"
          title="Actualiser"
        >
          ↻
        </button>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-white/70 text-lg">
        <span className="font-semibold text-white">Troyes</span>
        <span className="text-white/25 text-sm">━━▶</span>
        <span className="font-semibold text-white">{train.destination}</span>
        {train.trainNumber && (
          <span className="ml-auto text-white/25 text-xs">n°{train.trainNumber}</span>
        )}
      </div>

      {/* Time + status */}
      <div className="flex items-center gap-4">
        <span className={`font-light leading-none ${cfg.color}`} style={{ fontSize: '3.5rem' }}>
          {displayTime}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block ${cfg.dot} ${train.status === 'on_time' ? 'animate-pulse' : ''}`} />
            <span className={`font-medium text-base ${cfg.color}`}>{cfg.label}</span>
          </div>
          {train.delayMinutes && train.delayMinutes > 0 && (
            <span className="text-amber-400/70 text-sm pl-4">+{train.delayMinutes} min</span>
          )}
        </div>
      </div>

      {/* Countdown + update */}
      <div className="flex items-center justify-between text-white/25 text-xs">
        <span>Départ {countdownLabel}</span>
        <span>Mis à jour à {lastUpdatedStr}</span>
      </div>
    </div>
  )
}
