import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TopBar({ breadcrumbs = [] }) {
  const { user } = useApp()
  const navigate = useNavigate()

  return (
    <header style={{
      height: 64, background: 'rgba(246,250,254,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(195,198,215,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#64748b' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>}
            <span style={{
              color: i === breadcrumbs.length - 1 ? '#171c1f' : '#64748b',
              fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
              cursor: crumb.path ? 'pointer' : 'default',
            }}
              onClick={() => crumb.path && navigate(crumb.path)}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg,#004ac6,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 600,
        }}>{user.initials}</div>
      </div>
    </header>
  )
}
