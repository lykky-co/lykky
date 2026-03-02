export function StepByStep({ children }: { children: React.ReactNode }) {
  return <div className="my-8 space-y-6">{children}</div>
}

export function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
