import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import RiskBadge from '../components/RiskBadge'

function KPICard({ title, value, sub, icon, iconBg, iconColor, accent, border }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 24,
      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      border: border || '1px solid rgba(195,198,215,0.3)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
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
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { history } = useApp()

  const total = history.length
  const low = history.filter(h => h.riskLevel === 'low').length
  const med = history.filter(h => h.riskLevel === 'medium').length
  const high = history.filter(h => h.riskLevel === 'high').length
  const recent = history.slice(0, 5)

  const lowPct = Math.round((low / total) * 100) || 0
  const medPct = Math.round((med / total) * 100) || 0
  const highPct = 100 - lowPct - medPct

  // Build conic gradient for donut
  const donut = `conic-gradient(#006329 0% ${lowPct}%, #4059aa ${lowPct}% ${lowPct + medPct}%, #ba1a1a ${lowPct + medPct}% 100%)`

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก' }, { label: 'Dashboard' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Dashboard</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 15 }}>ภาพรวมการประเมินผู้ขอสินเชื่อ</p>
            </div>
            <button
              onClick={() => navigate('/new-assessment')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#004ac6,#2563eb)',
                color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', fontFamily: 'Prompt, sans-serif',
              }}
            >
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18 }}>add_chart</span>
              ประเมินเคสใหม่
            </button>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
            <KPICard title="เคสทั้งหมด" value={total} icon="folder_open" iconBg="#dbe1ff" iconColor="#004ac6" />
            <KPICard title="ความเสี่ยงต่ำ" value={low} sub="เคส" icon="check_circle" iconBg="#7ffc97" iconColor="#006329" />
            <KPICard title="ความเสี่ยงปานกลาง" value={med} sub="เคส" icon="warning" iconBg="#dce1ff" iconColor="#4059aa" />
            <KPICard title="ความเสี่ยงสูง" value={high} sub="เคสต้องระวัง"
              icon="error" iconBg="#ffdad6" iconColor="#ba1a1a"
              accent="#ba1a1a" border="1px solid rgba(255,218,214,0.8)" />
          </div>

          {/* Chart + Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
            {/* Donut */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: 32,
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
              border: '1px solid rgba(195,198,215,0.2)',
              display: 'flex', alignItems: 'center', gap: 40,
            }}>
              <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: donut,
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '60%', height: '60%', borderRadius: '50%',
                  background: '#fff', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                }}>
                  <span style={{ fontSize: 26, fontWeight: 600 }}>{total}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Total</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>สัดส่วนความเสี่ยง</h3>
                {[
                  { color: '#006329', label: 'ความเสี่ยงต่ำ', pct: lowPct, count: low },
                  { color: '#4059aa', label: 'ความเสี่ยงปานกลาง', pct: medPct, count: med },
                  { color: '#ba1a1a', label: 'ความเสี่ยงสูง', pct: highPct, count: high },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
                        <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{r.pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${r.pct}%`, background: r.color, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div style={{
              background: 'linear-gradient(135deg,#f0f4f8,#eaeef2)',
              borderRadius: 20, padding: 28,
              border: '1px solid rgba(195,198,215,0.2)',
              display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#004ac6', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Key Insights</p>
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, display: 'flex', gap: 12 }}>
                <span className="material-symbols-outlined icon-fill" style={{ color: '#006329', fontSize: 22, marginTop: 2 }}>trending_up</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>ความเสี่ยงต่ำมากที่สุด</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>คุณภาพสินเชื่อโดยรวมอยู่ในเกณฑ์ดี</p>
                </div>
              </div>
              {high > 0 && (
                <div style={{ background: 'rgba(255,218,214,0.5)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, border: '1px solid rgba(186,26,26,0.15)' }}>
                  <span className="material-symbols-outlined icon-fill" style={{ color: '#ba1a1a', fontSize: 22, marginTop: 2 }}>policy</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#ba1a1a', margin: 0 }}>{high} เคสควรตรวจสอบเพิ่มเติม</p>
                    <p style={{ fontSize: 12, color: '#93000a', margin: '4px 0 0' }}>ต้องการการพิจารณาเชิงลึก</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Table */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(195,198,215,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>รายการประเมินล่าสุด</h3>
              <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#004ac6', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Prompt, sans-serif' }}>
                ดูทั้งหมด <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(240,244,248,0.6)' }}>
                    {['รหัสอ้างอิง','ชื่อผู้ขอสินเชื่อ','วันที่','คะแนน','ระดับความเสี่ยง','คำแนะนำ',''].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => (
                    <tr key={r.id} style={{ borderTop: '1px solid rgba(195,198,215,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,244,248,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 500, color: '#64748b' }}>{r.id}</td>
                      <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b' }}>{r.date}</td>
                      <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 600, color: r.riskLevel === 'high' ? '#ba1a1a' : '#171c1f' }}>{r.score}</td>
                      <td style={{ padding: '16px 20px' }}><RiskBadge level={r.riskLevel} label={r.riskLabel} /></td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.recommendation}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <button onClick={() => navigate(`/history/${r.id}`)} style={{
                          background: '#dbe1ff', border: 'none', borderRadius: 8, padding: '6px 8px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#004ac6',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
