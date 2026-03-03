import { cn } from '@/lib/utils'

const variants = {
  tip: { border: 'border-primary/50', bg: 'bg-primary/5', icon: '💡' },
  warning: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/5', icon: '⚠️' },
  info: { border: 'border-blue-500/50', bg: 'bg-blue-500/5', icon: 'ℹ️' },
}

export function Callout({
  type = 'info',
  children,
}: {
  type?: 'tip' | 'warning' | 'info'
  children: React.ReactNode
}) {
  const v = variants[type]
  return (
    <div className={cn('my-6 rounded-lg border-l-4 p-4', v.border, v.bg)}>
      <div className="flex gap-3">
        <span className="text-lg">{v.icon}</span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
