interface Props {
  variant?: 'header' | 'footer' | 'compact' | 'banner'
}

const G = '#1B4D3E'
const DARK = '#0A2E1A'
const GOLD = '#C4943A'

export default function NationalAssetBadge({ variant = 'footer' }: Props) {
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(196,148,58,0.12)', borderRadius: 999,
        padding: '4px 12px', fontSize: 11, fontWeight: 700,
        color: GOLD, border: '1px solid rgba(196,148,58,0.3)',
        letterSpacing: '0.03em',
      }}>
        <span>🇬🇲</span>
        <span>National Digital Asset — The Gambia</span>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div style={{
        background: 'rgba(196,148,58,0.08)', borderTop: `2px solid ${GOLD}`,
        borderBottom: '1px solid rgba(196,148,58,0.2)',
        padding: '8px 0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: 12, color: '#555' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>🇬🇲 <strong>Proposed Gambia National Digital Asset</strong></span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>⚖️ Aligned with NDP 2023-2027</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>🌍 SDG 16: Peace, Justice &amp; Strong Institutions</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>🔐 GDPA 2018 Compliant</span>
        </div>
      </div>
    )
  }

  if (variant === 'header') {
    return (
      <div style={{
        background: `linear-gradient(90deg, ${DARK}, ${G})`,
        borderLeft: `4px solid ${GOLD}`,
        padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 20 }}>🇬🇲</span>
        <span style={{ fontWeight: 700, color: GOLD, fontSize: 13, letterSpacing: '0.04em' }}>GAMBIA NATIONAL DIGITAL ASSET</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Strategic Public Infrastructure</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Aligned with NDP 2023-2027</span>
      </div>
    )
  }

  // footer
  return (
    <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 16, marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>🇬🇲</span>
        <span style={{ fontWeight: 700, color: GOLD, fontSize: 13, letterSpacing: '0.06em' }}>GAMBIA NATIONAL DIGITAL ASSET</span>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '50ch', margin: 0 }}>
        Fortis OS is proposed as strategic public digital infrastructure for The Gambia, aligned with NDP 2023-2027 Priorities 3.2, 4.1, and 5.3. SDG 16 compliant · GDPA 2018 compliant.
      </p>
    </div>
  )
}
