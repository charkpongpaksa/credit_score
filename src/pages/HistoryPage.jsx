import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import RiskBadge from '../components/RiskBadge'

const PAGE_SIZE = 8

export default function HistoryPage() {
  const navigate = useNavigate()
  const { history } = useApp()
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return history.filter(h => {
      const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.id.toLowerCase().includes(search.toLowerCase())
      const matchRisk = !filterRisk || h.riskLevel === filterRisk
      return matchSearch && matchRisk
    })
  }, [history, search, filterRisk])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const thStyle = { padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }
  const tdStyle = { padding: '15px 20px', borderTop: '1px solid rgba(195,198,215,0.15)' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประวัติการประเมิน' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>ประวัติการประเมิน</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>ตรวจสอบและจัดการผลการประเมินความเสี่ยงสินเชื่อย้อนหลัง</p>
            </div>
            <button onClick={() => navigate('/new-assessment')} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
              borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg,#004ac6,#2563eb)', color: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Prompt,sans-serif',
            }}>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18 }}>add_circle</span>
              ประเมินเคสใหม่
            </button>
          </div>

          {/* Filter Bar */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20,
            boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)',
            display: 'flex', gap: 16, alignItems: 'flex-end',
          }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>ค้นหา (ชื่อ / รหัสเคส)</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>search</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="ระบุคำค้นหา..." style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>ระดับความเสี่ยง</label>
              <div style={{ position: 'relative' }}>
                <select value={filterRisk} onChange={e => { setFilterRisk(e.target.value); setPage(1) }} style={{ paddingRight: 36 }}>
                  <option value="">ทั้งหมด</option>
                  <option value="high">สูง (High)</option>
                  <option value="medium">ปานกลาง (Medium)</option>
                  <option value="low">ต่ำ (Low)</option>
                </select>
                <span className="material-symbols-outlined" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#64748b', pointerEvents: 'none' }}>expand_more</span>
              </div>
            </div>
            <button onClick={() => { setSearch(''); setFilterRisk(''); setPage(1) }} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              borderRadius: 10, border: '1px solid rgba(195,198,215,0.5)',
              background: '#fff', color: '#64748b', fontSize: 13,
              cursor: 'pointer', fontFamily: 'Prompt,sans-serif', whiteSpace: 'nowrap',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_alt_off</span>
              ล้างตัวกรอง
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(240,244,248,0.6)' }}>
                  <tr>
                    <th style={thStyle}>ID เคส</th>
                    <th style={thStyle}>ชื่อลูกค้า / บริษัท</th>
                    <th style={thStyle}>วันที่ประเมิน</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>คะแนน</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>ระดับความเสี่ยง</th>
                    <th style={thStyle}>ข้อแนะนำเบื้องต้น</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>search_off</span>
                        ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : paginated.map(r => {
                    const initials = r.name.slice(0, 2).toUpperCase()
                    const avatarBg = r.riskLevel === 'low' ? '#7ffc97' : r.riskLevel === 'high' ? '#ffdad6' : '#dce1ff'
                    const avatarColor = r.riskLevel === 'low' ? '#002109' : r.riskLevel === 'high' ? '#93000a' : '#00164e'
                    return (
                      <tr key={r.id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,244,248,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...tdStyle, fontWeight: 500, color: '#64748b', fontSize: 13 }}>{r.id}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarBg, color: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{initials}</div>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, fontSize: 13, color: '#64748b' }}>{r.date}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontSize: 15, fontWeight: 700, color: r.riskLevel === 'high' ? '#ba1a1a' : r.riskLevel === 'medium' ? '#4059aa' : '#006329' }}>{r.score}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}><RiskBadge level={r.riskLevel} label={r.riskLabel} /></td>
                        <td style={{ ...tdStyle, fontSize: 13, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.recommendation}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <button onClick={() => navigate(`/history/${r.id}`)} style={{
                            background: '#dbe1ff', border: 'none', borderRadius: 8, padding: '6px 8px',
                            cursor: 'pointer', color: '#004ac6', display: 'inline-flex', alignItems: 'center',
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(195,198,215,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                แสดง {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} ถึง {Math.min(page * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(195,198,215,0.4)', background: '#fff', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, display: 'block' }}>chevron_left</span>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none',
                    background: p === page ? '#004ac6' : '#fff',
                    color: p === page ? '#fff' : '#64748b',
                    fontWeight: p === page ? 600 : 400, cursor: 'pointer',
                    fontFamily: 'Prompt,sans-serif', fontSize: 13,
                    border: p === page ? 'none' : '1px solid rgba(195,198,215,0.4)',
                  }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(195,198,215,0.4)', background: '#fff', cursor: (page === totalPages || totalPages === 0) ? 'default' : 'pointer', opacity: (page === totalPages || totalPages === 0) ? 0.4 : 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, display: 'block' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
