export function TerLogo({ size = 56 }: { size?: number }) {
  const scale = size / 56
  return (
    <svg
      width={Math.round(100 * scale)}
      height={size}
      viewBox="0 0 100 56"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TER Fluo Grand Est"
    >
      {/* Background pill */}
      <rect width="100" height="56" rx="8" fill="#1a0533" />

      {/* Left accent stripe */}
      <rect width="6" height="56" rx="0" fill="url(#terGradient)" />
      <defs>
        <linearGradient id="terGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="fluoGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* TER — main letters */}
      <text
        x="14"
        y="38"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="-0.5"
        fill="white"
      >
        TER
      </text>

      {/* fluo */}
      <text
        x="63"
        y="26"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="url(#fluoGrad)"
        letterSpacing="1"
      >
        fluo
      </text>

      {/* grand est */}
      <text
        x="63"
        y="41"
        fontFamily="Arial, sans-serif"
        fontWeight="400"
        fontSize="9"
        fill="rgba(255,255,255,0.55)"
        letterSpacing="0.5"
      >
        grand est
      </text>
    </svg>
  )
}
