import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  helper: string
  tone: 'ember' | 'mint' | 'sky' | 'sand'
}

export function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">
        <Icon size={20} />
      </div>
      <div className="stat-card__copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{helper}</p>
      </div>
    </article>
  )
}
