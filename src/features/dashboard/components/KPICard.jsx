import Card from '../../../components/ui/Card'

export default function KPICard({ title, value, sub, icon, iconBg, iconColor, accent, border }) {
  return (
    <Card 
      padding={24} 
      border={border}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18, color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 600, color: accent || '#171c1f' }}>{value}</span>
        {sub && <span style={{ fontSize: 13, color: '#64748b' }}>{sub}</span>}
      </div>
    </Card>
  )
}
