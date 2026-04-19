'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { getHealthService, getModelInfoService } from '@/services/health'
import { getPredictionsService } from '@/services/prediction'
import { HealthResponse, ModelInfoResponse } from '@/types/health'
import { PredictionsResponse } from '@/types/prediction'
import KPICard from '@/components/dashboard/KPICard'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import RiskBadge from '@/components/ui/RiskBadge'
import Card from '@/components/ui/Card'

export default function DashboardPage() {
  const router = useRouter()
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null)
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, m, p] = await Promise.all([
          getHealthService(),
          getModelInfoService(),
          getPredictionsService(5)
        ])
        setHealth(h)
        setModelInfo(m)
        setPredictions(p)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก' }, { label: 'Dashboard' }]} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
              <p className="text-slate-500 mt-1 text-[15px]">ภาพรวมการประเมินความเสี่ยงจากระบบ AI</p>
            </div>
            <div className="flex gap-3">
              <div className={`px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 border ${health?.status === 'ok' ? 'bg-risk-low-bg/10 text-risk-low-dark border-risk-low-dark/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                <span className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-risk-low-dark animate-pulse' : 'bg-slate-300'}`} />
                API STATUS: {health?.status?.toUpperCase() || 'OFFLINE'}
              </div>
              <Button onClick={() => router.push('/predict')} icon="add_chart">
                ประเมินเคสใหม่
              </Button>
            </div>
          </div>

          {/* Model info banner */}
          {modelInfo && (
            <div className="bg-brand text-white p-6 rounded-2xl flex justify-between items-center shadow-lg shadow-brand/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined !text-[120px]">psychology</span>
               </div>
               <div>
                  <p className="text-blue-100 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">Active AI Model</p>
                  <h3 className="text-xl font-bold">{modelInfo.model_version}</h3>
                  <div className="flex gap-6 mt-3">
                    <div className="flex flex-col">
                      <span className="text-blue-200 text-[10px] uppercase font-bold">Fields</span>
                      <span className="text-lg font-bold">{modelInfo.num_raw_fields}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-blue-200 text-[10px] uppercase font-bold">Features</span>
                      <span className="text-lg font-bold">{modelInfo.num_model_features}</span>
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold backdrop-blur-md">PRODUCTION READY</span>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard title="เความเสี่ยงต่ำ" value={predictions?.items.filter(i => i.predictions[0].risk_band_en === 'low').length || 0} icon="check_circle" iconBg="#7ffc97" iconColor="#006329" />
            <KPICard title="ความเสี่ยงปานกลาง" value={predictions?.items.filter(i => i.predictions[0].risk_band_en === 'medium').length || 0} icon="warning" iconBg="#dce1ff" iconColor="#4059aa" />
            <KPICard title="ความเสี่ยงสูง" value={predictions?.items.filter(i => i.predictions[0].risk_band_en === 'high').length || 0} icon="error" iconBg="#ffdad6" iconColor="#ba1a1a" accent="#ba1a1a" border />
            <KPICard title="ประเมินทั้งหมด" value={predictions?.count || 0} icon="folder_open" iconBg="#dbe1ff" iconColor="#004ac6" />
          </div>

          <Card className="!p-0 overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">ประวัติการประเมินล่าสุด (จาก API)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['รหัสอ้างอิง','วัน/เวลา','ค่าความน่าจะเป็น','ระดับความเสี่ยง',''].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider ${i === 2 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {predictions?.items.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-mono font-bold text-slate-400 whitespace-nowrap">#{r.id}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">{new Date(r.created_at).toLocaleString('th-TH')}</td>
                      <td className="px-5 py-4 text-base font-bold text-right whitespace-nowrap">{(r.predictions[0].default_probability * 100).toFixed(2)}%</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <RiskBadge 
                          level={r.predictions[0].risk_band_en as any} 
                          label={r.predictions[0].risk_band} 
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="secondary" icon="visibility" />
                      </td>
                    </tr>
                  ))}
                  {(!predictions || predictions.items.length === 0) && !loading && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm italic">ไม่มีข้อมูลประวัติในขณะนี้</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
