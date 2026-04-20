'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import { getPredictionByIdService } from '@/services/prediction'
import { PredictionDetailResponse } from '@/types/prediction'

function pretty(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj ?? '')
  }
}

export default function PredictionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [data, setData] = useState<PredictionDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const detail = await getPredictionByIdService(id)
        setData(detail)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.response?.data?.detail || 'โหลดรายละเอียดไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const pred = data?.predictions?.[0]
  const createdAt = data?.createdAt || data?.created_at
  const requestPayload = data?.requestPayload || data?.request_payload
  const translatedPayload = data?.translatedPayload || data?.translated_payload

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'ประวัติ AI', path: '/predictions' }, { label: `Request ${id}` }]} />
        <main className="flex-1 overflow-y-auto p-7 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900">Prediction Detail</h1>
              <p className="text-slate-500 text-sm mt-1">Request ID: {id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => router.push('/predictions')} icon="arrow_back">กลับรายการ</Button>
              <Button onClick={() => router.push('/predict')} icon="add_chart">ประเมินใหม่</Button>
            </div>
          </div>

          {loading && <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-500">กำลังโหลด...</div>}
          {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

          {!loading && data && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:col-span-2">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">ผลลัพธ์ AI</h3>
                  <div className="space-y-2 text-sm">
                    <div>Model: <span className="font-semibold">{data.modelVersion || data.model_version}</span></div>
                    <div>Created: <span className="font-semibold">{createdAt ? new Date(createdAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '-'}</span></div>
                    <div>Threshold: <span className="font-semibold">{data.threshold}</span></div>
                    <div>Risk: <span className="font-semibold uppercase">{pred?.riskBandEn || pred?.risk_band_en || '-'}</span></div>
                    <div>Default Probability: <span className="font-semibold">{(((pred?.defaultProbability ?? pred?.default_probability) || 0) * 100).toFixed(2)}%</span></div>
                    <div>Decision: <span className="font-semibold">{pred?.decision || '-'}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Meta</h3>
                  <div className="space-y-2 text-sm">
                    <div>Request ID: <span className="font-mono">{data.id}</span></div>
                    <div>Client IP: <span className="font-semibold">{data.clientIp || data.client_ip || '-'}</span></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Request Payload</h3>
                  <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto max-h-[420px]">{pretty(requestPayload)}</pre>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Translated Payload</h3>
                  <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-auto max-h-[420px]">{pretty(translatedPayload)}</pre>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
