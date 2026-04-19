import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Card from '@/components/ui/Card'
import { getPredictionsService } from '@/services/prediction'
import RiskBadge from '@/components/ui/RiskBadge'
import Button from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // Example of Server Component Data Fetching in Next.js
  let record = null
  try {
    const history = await getPredictionsService(200)
    record = history.items.find(h => h.id.toString() === id)
  } catch (err) {
    console.error('Failed to fetch detail', err)
  }

  if (!record) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-app-bg">
          <span className="material-symbols-outlined text-[64px] text-slate-200">find_in_page</span>
          <p className="text-slate-500 font-medium tracking-tight">ไม่พบรายการที่ต้องการ</p>
          <a href="/history">
            <Button className="mt-2">กลับไปประวัติ</Button>
          </a>
        </div>
      </div>
    )
  }

  const riskLevel = record.predictions[0].risk_band_en as 'low' | 'medium' | 'high'
  const color = riskLevel === 'low' ? '#006329' : riskLevel === 'high' ? '#ba1a1a' : '#4059aa'

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'ประวัติการประเมิน', path: '/history' }, { label: record.id.toString() }]} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
              <div>
                <p className="text-[13px] text-slate-400 font-mono tracking-widest mb-1.5 uppercase">ID: #{record.id} • {new Date(record.created_at).toLocaleString('th-TH')}</p>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">รายละเอียดการประเมิน</h1>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <a href="/history"><Button variant="secondary" icon="arrow_back">กลับไปประวัติ</Button></a>
                <a href="/predict"><Button icon="refresh">ประเมินใหม่อีกครั้ง</Button></a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <Card>
                  <h2 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2.5">
                    <span className="material-symbols-outlined icon-fill text-brand !text-[22px]">dns</span>
                    Metadata
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                      { label: 'Model Version', value: record.model_version },
                      { label: 'Threshold', value: record.threshold },
                      { label: 'Client IP', value: record.client_ip },
                      { label: 'Created At', value: record.created_at },
                    ].map(item => (
                      <div key={item.label} className="border-b border-slate-50 pb-2">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-[15px] font-semibold text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2.5">
                    <span className="material-symbols-outlined icon-fill text-brand !text-[22px]">analytics</span>
                    Model Prediction Detail
                  </h2>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                     <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Default Probability</span>
                        <span className="text-2xl font-black text-brand">{(record.predictions[0].default_probability * 100).toFixed(4)}%</span>
                     </div>
                     <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Decision result</span>
                        <span className="text-sm font-bold text-slate-800 text-right">{record.predictions[0].decision}</span>
                     </div>
                  </div>
                </Card>
              </div>

              <div className="flex flex-col gap-6">
                <Card className="text-center overflow-hidden border-t-4 bg-white shadow-xl" style={{ borderTopColor: color }}>
                  <div className={`py-8 ${riskLevel === 'low' ? 'bg-risk-low-bg/5' : 'bg-risk-high-bg/5'}`}>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Risk Level</p>
                    <p className="text-4xl font-black tracking-tighter mb-4 uppercase" style={{ color }}>{riskLevel}</p>
                    <div className="flex justify-center">
                      <RiskBadge level={riskLevel} label={record.predictions[0].risk_band} size="lg" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
