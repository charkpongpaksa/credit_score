'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import { getPredictionsService } from '@/services/prediction'
import { PredictionHistoryItem } from '@/types/prediction'

export default function PredictionsPage() {
  const router = useRouter()
  const [items, setItems] = useState<PredictionHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPredictionsService(30)
        setItems(data.items || [])
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.response?.data?.detail || 'โหลดประวัติ AI ไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDate = (value?: string) => {
    if (!value) return '-'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' })
  }

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประวัติ AI' }]} />
        <main className="flex-1 overflow-y-auto p-7 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900">ประวัติ AI Predictions</h1>
              <p className="text-slate-500 text-sm mt-1">รายการผลจาก `/api/v1/predict`</p>
            </div>
            <Button icon="add_chart" onClick={() => router.push('/predict')}>ประเมินใหม่</Button>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-slate-500">Request ID</th>
                  <th className="text-left px-5 py-3 text-xs text-slate-500">วันที่</th>
                  <th className="text-left px-5 py-3 text-xs text-slate-500">Model</th>
                  <th className="text-left px-5 py-3 text-xs text-slate-500">Risk</th>
                  <th className="text-left px-5 py-3 text-xs text-slate-500">Default %</th>
                  <th className="text-right px-5 py-3 text-xs text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td className="px-5 py-10 text-sm text-slate-400" colSpan={6}>กำลังโหลด...</td></tr>
                )}
                {!loading && items.length === 0 && (
                  <tr><td className="px-5 py-10 text-sm text-slate-400" colSpan={6}>ยังไม่มีข้อมูล</td></tr>
                )}
                {!loading && items.map((item) => {
                  const pred = item.predictions?.[0]
                  const risk = pred?.risk_band_en || '-'
                  const prob = pred?.default_probability ?? 0
                  return (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-sm">{item.id}</td>
                      <td className="px-5 py-3 text-sm">{formatDate(item.createdAt || item.created_at)}</td>
                      <td className="px-5 py-3 text-sm">{item.modelVersion || item.model_version}</td>
                      <td className="px-5 py-3 text-sm uppercase">{risk}</td>
                      <td className="px-5 py-3 text-sm">{(prob * 100).toFixed(2)}%</td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" onClick={() => router.push(`/predictions/${item.id}`)} icon="visibility">ดู</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
