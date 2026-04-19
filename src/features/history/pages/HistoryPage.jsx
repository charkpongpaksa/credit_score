import { useNavigate } from 'react-router-dom'
import { useApp } from '../../../context/AppContext'
import Sidebar from '../../../components/layout/Sidebar'
import TopBar from '../../../components/layout/TopBar'
import RiskBadge from '../../../components/ui/RiskBadge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { Field, Input, Select } from '../../../components/ui/FormElements'
import { useHistory } from '../hooks/useHistory'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { history } = useApp()
  const PAGE_SIZE = 8
  
  const {
    search, setSearch,
    filterRisk, setFilterRisk,
    page, setPage,
    paginated, totalPages, totalRecords,
    resetFilters
  } = useHistory(history, PAGE_SIZE)

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
            <Button onClick={() => navigate('/new-assessment')} icon="add_circle">
              ประเมินเคสใหม่
            </Button>
          </div>

          {/* Filter Bar */}
          <Card padding={20} style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <Field label="ค้นหา (ชื่อ / รหัสเคส)">
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#94a3b8' }}>search</span>
                  <Input 
                    value={search} 
                    onChange={e => { setSearch(e.target.value); setPage(1) }} 
                    placeholder="ระบุคำค้นหา..." 
                    style={{ paddingLeft: 40 }} 
                  />
                </div>
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="ระดับความเสี่ยง">
                <Select 
                  value={filterRisk} 
                  onChange={e => { setFilterRisk(e.target.value); setPage(1) }}
                  options={[
                    { value: 'high', label: 'สูง (High)' },
                    { value: 'medium', label: 'ปานกลาง (Medium)' },
                    { value: 'low', label: 'ต่ำ (Low)' }
                  ]}
                  placeholder="ทั้งหมด"
                />
              </Field>
            </div>
            <Button onClick={resetFilters} variant="secondary" icon="filter_alt_off">
              ล้างตัวกรอง
            </Button>
          </Card>

          {/* Records Table */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(240,244,248,0.6)' }}>
                  <tr>
                    {['ID เคส','ชื่อลูกค้า','วันที่ประเมิน','คะแนน','ระดับความเสี่ยง','จัดการ'].map((h, i) => (
                      <th key={h} style={{ 
                        padding: '12px 20px', textAlign: i === 3 ? 'right' : i > 3 ? 'center' : 'left', 
                        fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>search_off</span>
                        ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : paginated.map(r => (
                    <tr key={r.id} style={{ borderTop: '1px solid rgba(195,198,215,0.15)' }}>
                      <td style={{ padding: '15px 20px', fontWeight: 500, color: '#64748b', fontSize: 13 }}>{r.id}</td>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', 
                            background: r.riskLevel === 'low' ? '#7ffc97' : r.riskLevel === 'high' ? '#ffdad6' : '#dce1ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600
                          }}>
                            {r.name.slice(0, 1)}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px', fontSize: 13, color: '#64748b' }}>{r.date}</td>
                      <td style={{ padding: '15px 20px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: r.riskColor }}>{r.score}</td>
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}><RiskBadge level={r.riskLevel} label={r.riskLabel} /></td>
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <Button onClick={() => navigate(`/history/${r.id}`)} variant="secondary" icon="visibility" style={{ padding: '6px 12px' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(195,198,215,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                แสดง {totalRecords === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} ถึง {Math.min(page * PAGE_SIZE, totalRecords)} จาก {totalRecords} รายการ
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="secondary" style={{ padding: '6px 8px' }} icon="chevron_left" />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: p === page ? 'none' : '1px solid rgba(195,198,215,0.4)',
                      background: p === page ? '#004ac6' : '#fff', color: p === page ? '#fff' : '#64748b',
                      fontWeight: p === page ? 600 : 400, cursor: 'pointer', fontFamily: 'Prompt, sans-serif', fontSize: 13
                    }}
                  >{p}</button>
                ))}
                <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} variant="secondary" style={{ padding: '6px 12px' }} icon="chevron_right" />
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
