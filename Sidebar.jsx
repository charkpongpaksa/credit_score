import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'หน้าหลัก' },
  { path: '/new-assessment', icon: 'analytics', label: 'ประเมินใหม่' },
  { path: '/history', icon: 'history', label: 'ประวัติการประเมิน' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useApp()

  return (
    <nav style={{
      width: 240, minHeight: '100vh', background: '#0f172a',
      display: 'flex', flexDirection: 'column', padding: '24px 0',
      flexShrink: 0, position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '0 24px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#004ac6,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 16,
        }}>AS</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>Analytical Sanctuary</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>Credit Risk System</div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', borderRadius: 10, border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: active ? '#fff' : '#94a3b8',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                borderRight: active ? '3px solid #3b82f6' : '3px solid transparent',
                transition: 'all 0.15s',
                fontFamily: 'Prompt, sans-serif',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}
            >
              <span className={`material-symbols-outlined${active ? ' icon-fill' : ''}`}
                style={{ fontSize: 20, color: active ? '#60a5fa' : '#64748b' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </div>

      {/* User + logout */}
      <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#004ac6,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 600,
          }}>{user.initials}</div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{user.name}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Loan Officer</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 10, border: 'none',
            cursor: 'pointer', width: '100%',
            background: 'transparent', color: '#94a3b8',
            fontSize: 14, fontFamily: 'Prompt, sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          ออกจากระบบ
        </button>
      </div>
    </nav>
  )
}
