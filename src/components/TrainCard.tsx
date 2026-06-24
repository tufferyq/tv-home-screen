import type { TrainInfo, TrainStatus } from '../hooks/useTrain'
import { useClock } from '../hooks/useClock'

interface Props {
  train: TrainInfo
  onRefresh: () => void
}

const STATUS_CONFIG: Record<TrainStatus, { label: string; color: string; bg: string; icon: string }> = {
  on_time: {
    label: "À l'heure",
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    icon: '✓',
  },
  delayed: {
    label: 'Retard',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/30',
    icon: '⚠',
  },
  cancelled: {
    label: 'Supprimé',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    icon: '✕',
  },
  unknown: {
    label: 'Indisponible',
    color: 'text-white/40',
    bg: 'bg-white/5 border-white/10',
    icon: '?',
  },
  loading: {
    label: 'Chargement…',
    color: 'text-white/40',
    bg: 'bg-white/5 border-white/10',
    icon: '…',
  },
}

export function TrainCard({ train, onRefresh }: Props) {
  const now = useClock()
  const cfg = STATUS_CONFIG[train.status]

  const minutesUntil = (() => {
    const [h, m] = train.departureTime.split(':').map(Number)
    const dep = new Date(now)
    dep.setHours(h, m, 0, 0)
    const diff = Math.round((dep.getTime() - now.getTime()) / 60000)
    return diff
  })()

  const lastUpdatedStr = `${String(train.lastUpdated.getHours()).padStart(2, '0')}:${String(train.lastUpdated.getMinutes()).padStart(2, '0')}`

  return (
    <div className={`border rounded-3xl p-8 flex flex-col gap-4 ${cfg.bg}`} style={{ minWidth: '420px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚄</span>
          <div>
            <div className="text-white/60 font-medium tracking-widest uppercase text-sm">TER Fluo Grand Est</div>
            {train.trainNumber && (
              <div className="text-white/30 text-xs">Train n°{train.trainNumber}</div>
            )}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="text-white/20 hover:text-white/60 transition-colors text-xl"
          title="Actualiser"
        >
          ↻
        </button>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 text-white/80 text-lg">
        <span className="font-medium">Troyes</span>
        <span className="text-white/30 text-base">→</span>
        <span className="font-medium">{train.destination}</span>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span className={`text-4xl font-light ${cfg.color}`}>
          {train.status === 'delayed' && train.expectedTime
            ? train.expectedTime
            : train.departureTime}
        </span>
        <div className="flex flex-col">
          <span className={`font-medium text-lg ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          {train.delayMinutes && train.delayMinutes > 0 && (
            <span className="text-amber-400/70 text-sm">+{train.delayMinutes} min</span>
          )}
        </div>
      </div>

      {/* Countdown */}
      <div className="text-white/30 text-sm">
        {minutesUntil > 0 && minutesUntil < 480
          ? `Départ dans ${minutesUntil} min`
          : minutesUntil <= 0
          ? 'Déjà parti'
          : 'Demain matin'}
        {' · '}Mis à jour à {lastUpdatedStr}
      </div>
    </div>
  )
}
