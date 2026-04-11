export function ScanlineOverlay() {
  return (
    <>
      {/* CRT scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        }}
        aria-hidden="true"
      />
      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
