export function Grain() {
  return (
    <>
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.045] mix-blend-overlay"
        aria-hidden="true"
      >
        <div
          className="absolute -inset-[200%] h-[400%] w-[400%] animate-[grain_0.8s_steps(8)_infinite]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />
      </div>

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.45) 65%, rgba(5,5,8,0.85) 100%)',
        }}
      />
    </>
  )
}
