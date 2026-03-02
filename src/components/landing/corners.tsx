'use client'

function CornerTL() {
  return (
    <div className="fixed top-7 left-7 z-20 hidden flex-col items-start sm:flex animate-[fadeIn_2s_ease-out_0.4s_forwards] opacity-0">
      <span className="mb-2.5 block h-px w-12 bg-[rgba(126,184,162,0.12)]" />
      <span className="absolute top-0 left-0 block h-12 w-px bg-[rgba(126,184,162,0.12)]" />
      <span className="font-sans text-[0.65rem] font-extralight uppercase tracking-[0.18em] text-[rgba(232,228,223,0.4)]">
        65&deg;01&prime;N&ensp;25&deg;28&prime;E
      </span>
    </div>
  )
}

function CornerTR() {
  return (
    <div className="fixed top-7 right-7 z-20 hidden flex-col items-end sm:flex animate-[fadeIn_2s_ease-out_0.4s_forwards] opacity-0">
      <span className="mb-2.5 block h-px w-12 bg-[rgba(126,184,162,0.12)]" />
      <span className="absolute top-0 right-0 block h-12 w-px bg-[rgba(126,184,162,0.12)]" />
      <span className="font-sans text-[0.65rem] font-extralight uppercase tracking-[0.18em] text-[rgba(232,228,223,0.4)]">
        2026
      </span>
    </div>
  )
}

function CornerBL() {
  return (
    <div className="fixed bottom-7 left-7 z-20 hidden flex-col items-start sm:flex animate-[fadeIn_2s_ease-out_0.4s_forwards] opacity-0">
      <span className="font-sans text-[0.65rem] font-extralight uppercase tracking-[0.18em] text-[rgba(232,228,223,0.4)]">
        4 founders
      </span>
      <span className="mt-2.5 block h-px w-12 bg-[rgba(126,184,162,0.12)]" />
      <span className="absolute bottom-0 left-0 block h-12 w-px bg-[rgba(126,184,162,0.12)]" />
    </div>
  )
}

function CornerBR() {
  return (
    <div className="fixed bottom-7 right-7 z-20 hidden flex-col items-end sm:flex animate-[fadeIn_2s_ease-out_0.4s_forwards] opacity-0">
      <span className="font-sans text-[0.65rem] font-extralight uppercase tracking-[0.18em] text-[rgba(232,228,223,0.4)]">
        Open Source
      </span>
      <span className="mt-2.5 block h-px w-12 bg-[rgba(126,184,162,0.12)]" />
      <span className="absolute bottom-0 right-0 block h-12 w-px bg-[rgba(126,184,162,0.12)]" />
    </div>
  )
}

export function Corners() {
  return (
    <>
      <CornerTL />
      <CornerTR />
      <CornerBL />
      <CornerBR />
    </>
  )
}
