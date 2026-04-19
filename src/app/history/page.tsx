'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { getPredictionsService } from '@/services/prediction'
import { PredictionsResponse, PredictionHistoryItem } from '@/types/prediction'
import Card from '@/components/ui/Card'
import RiskBadge from '@/components/ui/RiskBadge'
import Button from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/FormElements'

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    fetchHistory()
  }, [limit])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await getPredictionsService(limit)
      setPredictions(data)
    } catch (err) {
      console.error('Failed to fetch history', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = predictions?.items.filter(item => 
    item.id.toString().includes(search) || 
    item.client_ip.includes(search)
  ) || []

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประวัติการประเมิน' }]} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">ประวัติการประเมิน (History)</h2>
              <p className="text-slate-500 mt-1 text-sm">ข้อมูลการประเคราะห์ความเสี่ยงทั้งหมดที่ส่งไปที่ AI Model</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs text-slate-400 font-bold uppercase">Rows:</span>
               <select 
                 className="bg-white border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                 value={limit}
                 onChange={e => setLimit(parseInt(e.target.value))}
               >
                 <option value={10}>10</option>
                 <option value={20}>20</option>
                 <option value={50}>50</option>
               </select>
            </div>
          </div>

          <Card className="mb-6 p-5 flex gap-4 items-end">
             <div className="flex-1">
                <Field label="ค้นหา (ID / IP Address)">
                    <Input 
                      placeholder="ระบุคำค้นหา..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="!py-2"
                    />
                </Field>
             </div>
             <Button variant="secondary" icon="refresh" onClick={fetchHistory} loading={loading}>รีเฟรช</Button>
          </Card>

          <Card className="!p-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['ID เคส','วันที่/เวลา','IP','Score %','ระดับความเสี่ยง','จัดการ'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest
                        ${i === 3 ? 'text-right' : i > 3 ? 'text-center' : ''}
                      `}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400">
                        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                        <p className="text-xs mt-2">กำลังโหลดข้อมูลจาก API...</p>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 text-sm italic">ไม่พบข้อมูลประวัติ</td>
                    </tr>
                  ) : filteredItems.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400 tracking-wider">#{r.id}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 whitespace-nowrap">{new Date(r.created_at).toLocaleString('th-TH')}</td>
                      <td className="px-6 py-4 text-[12px] text-slate-400 font-mono">{r.client_ip}</td>
                      <td className="px-6 py-4 text-right text-base font-black tracking-tight text-slate-700">
                        {(r.predictions[0].default_probability * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <RiskBadge 
                          level={r.predictions[0].risk_band_en as any} 
                          label={r.predictions[0].risk_band} 
                        />
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <Button variant="secondary" icon="visibility" className="!px-3 !py-1.5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
