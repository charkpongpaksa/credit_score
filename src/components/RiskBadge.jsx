export default function RiskBadge({ level, label, size = 'sm' }) {
  const styles = {
    low:    { bg: '#7ffc97', color: '#002109', border: 'rgba(0,99,41,0.3)' },
    medium: { bg: '#dce1ff', color: '#00164e', border: 'rgba(64,89,170,0.3)' },
    high:   { bg: '#ffdad6', color: '#93000a', border: 'rgba(186,26,26,0.3)' },
  }
  const s = styles[level] || styles.medium
  const fs = size === 'lg' ? 14 : 12

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'lg' ? '5px 14px' : '3px 10px',
      borderRadius: 999, background: s.bg, color: s.color,
      fontSize: fs, fontWeight: 600, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, opacity: 0.8 }} />
      {label}
    </span>
  )
}
