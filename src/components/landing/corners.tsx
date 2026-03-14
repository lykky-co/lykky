'use client'

const base = 'fixed z-20 hidden sm:flex animate-[fadeIn_2s_ease-out_0.4s_forwards] opacity-0'
const line = 'block bg-[rgba(126,184,162,0.12)]'
const text = 'font-sans text-[0.65rem] font-extralight uppercase tracking-[0.18em] text-[rgba(232,228,223,0.4)]'

const corners = [
  { pos: 'top-7 left-7 flex-col items-start', label: '65\u00b001\u2032N\u2002 25\u00b028\u2032E', top: true, left: true },
  { pos: 'top-7 right-7 flex-col items-end', label: '2026', top: true, left: false },
  { pos: 'bottom-7 left-7 flex-col items-start', label: '4 founders', top: false, left: true },
  { pos: 'bottom-7 right-7 flex-col items-end', label: 'Open Source', top: false, left: false },
] as const

export function Corners() {
  return (
    <>
      {corners.map(({ pos, label, top, left }) => (
        <div key={label} className={`${base} ${pos}`}>
          {top && <span className={`mb-2.5 h-px w-12 ${line}`} />}
          <span className={`absolute ${top ? 'top-0' : 'bottom-0'} ${left ? 'left-0' : 'right-0'} h-12 w-px ${line}`} />
          <span className={text}>{label}</span>
          {!top && <span className={`mt-2.5 h-px w-12 ${line}`} />}
        </div>
      ))}
    </>
  )
}
