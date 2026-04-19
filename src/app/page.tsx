'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/FormElements'
import { loginService } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!form.username || !form.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    setLoading(true)
    setError('')
    try {
      await loginService({
        usernameOrEmail: form.username,
        password: form.password,
        rememberMe: true,
      })
      router.push('/dashboard')
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) {
        setError('Username/Email หรือรหัสผ่านไม่ถูกต้อง')
      } else if (status === 403) {
        setError('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบ')
      } else {
        setError(err?.response?.data?.message || err.message || 'เข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <div className="max-w-[900px] w-full flex bg-white rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
        {/* Left panel - Branding */}
        <div className="hidden md:flex w-[45%] p-12 bg-gradient-to-br from-brand to-brand-light flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
              <span className="material-symbols-outlined icon-fill text-white !text-[28px]">analytics</span>
            </div>
            <h1 className="text-white text-3xl font-semibold mb-3 leading-tight">
              ระบบประเมินความเสี่ยง<br />ผู้ขอสินเชื่อ
            </h1>
            <p className="text-white/75 text-sm leading-relaxed">
              ช่วยประเมินความเสี่ยงผู้ขอสินเชื่อได้รวดเร็วและเป็นมาตรฐาน เพื่อการตัดสินใจที่แม่นยำยิ่งขึ้น
            </p>
          </div>
        </div>

        {/* Right panel - Login Box */}
        <div className="flex-1 p-12 lg:p-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2 text-slate-900">เข้าสู่ระบบ</h2>
          <p className="text-slate-500 text-sm mb-8">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

          <div className="flex flex-col gap-5">
            <Field label="Username หรือ Email" hint="" error="">
              <Input
                type="text"
                placeholder="กรอก Username หรือ Email"
                value={form.username}
                prefix=""
                onChange={(e: any) => setForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={(e: any) => e.key === 'Enter' && handleLogin()}
              />
            </Field>

            <Field label="รหัสผ่าน" hint="" error="">
              <Input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={form.password}
                prefix=""
                onChange={(e: any) => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={(e: any) => e.key === 'Enter' && handleLogin()}
              />
            </Field>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-risk-high-bg text-risk-high-text text-sm border border-risk-high-border/30">
                <span className="material-symbols-outlined !text-[16px]">error</span>
                {error}
              </div>
            )}

            <Button onClick={handleLogin} disabled={loading} loading={loading} fullWidth className="mt-2 py-3" icon="">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </div>

          <p className="mt-8 text-[12px] text-slate-400 text-center uppercase tracking-wider font-medium">
            Analytical Sanctuary · Credit Risk System
          </p>
        </div>
      </div>
    </div>
  )
}
