import { useClock } from '../hooks/useClock'

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export function Clock() {
  const now = useClock()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const day = DAYS[now.getDay()]
  const date = `${day} ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-end gap-2">
        <span className="text-white font-light leading-none" style={{ fontSize: '9rem' }}>
          {hours}:{minutes}
        </span>
        <span className="text-white/40 font-light mb-6" style={{ fontSize: '3.5rem' }}>
          {seconds}
        </span>
      </div>
      <div className="text-white/60 font-light tracking-wide" style={{ fontSize: '1.6rem' }}>
        {date}
      </div>
    </div>
  )
}
