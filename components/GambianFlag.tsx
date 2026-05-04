interface Props {
  /** Preset size: sm=24px, md=36px, lg=56px, or explicit width */
  size?: 'sm' | 'md' | 'lg'
  width?: number
  height?: number
  /** Show "🇬🇲 The Gambia" text beside the flag */
  showText?: boolean
  style?: React.CSSProperties
  className?: string
}

const SIZE_MAP = { sm: [24, 16], md: [36, 24], lg: [56, 38] }

/**
 * Gambian Flag — inline SVG
 * Stripes (top→bottom): Red · white · Blue (wider) · white · Green
 * Proportions: 3:2 (W:H)
 */
export default function GambianFlag({
  size = 'md',
  width,
  height,
  showText = false,
  style,
  className,
}: Props) {
  const [w, h] = width && height ? [width, height] : SIZE_MAP[size]

  const flag = (
    <svg
      width={w}
      height={h}
      viewBox="0 0 90 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0 }}
      aria-label="Flag of The Gambia"
      role="img"
    >
      {/* Red stripe */}
      <rect x="0" y="0" width="90" height="18" fill="#E22020" />
      {/* White divider */}
      <rect x="0" y="18" width="90" height="4" fill="#FFFFFF" />
      {/* Blue stripe */}
      <rect x="0" y="22" width="90" height="16" fill="#1A4699" />
      {/* White divider */}
      <rect x="0" y="38" width="90" height="4" fill="#FFFFFF" />
      {/* Green stripe */}
      <rect x="0" y="42" width="90" height="18" fill="#1B7A3E" />
    </svg>
  )

  if (!showText) return <span style={{ display: 'inline-flex', ...style }} className={className}>{flag}</span>

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }} className={className}>
      {flag}
      <span style={{ fontSize: size === 'lg' ? 14 : 12, fontWeight: 600, color: '#1B4D3E' }}>
        🇬🇲 The Gambia
      </span>
    </span>
  )
}
