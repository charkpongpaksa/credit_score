import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { Field, Input } from '../../../components/ui/FormElements'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if (!form.username || !form.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f6fafe', padding: 16,
    }}>
      <div style={{
        maxWidth: 900, width: '100%', display: 'flex',
        background: '#fff', borderRadius: 20,
        boxShadow: '0 8px 40px rgba(15,23,42,0.08)', overflow: 'hidden', minHeight: 500,
      }}>
        {/* Left panel - Branding */}
        <div style={{
          width: '45%', padding: 48,
          background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: '#fff', fontSize: 28 }}>analytics</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 600, marginBottom: 12, lineHeight: 1.3 }}>
              ระบบประเมินความเสี่ยง<br />ผู้ขอสินเชื่อ
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7 }}>
              ช่วยประเมินความเสี่ยงผู้ขอสินเชื่อได้รวดเร็วและเป็นมาตรฐาน เพื่อการตัดสินใจที่แม่นยำยิ่งขึ้น
            </p>
          </div>
        </div>

        {/* Right panel - Login Box */}
        <div style={{ flex: 1, padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#171c1f' }}>เข้าสู่ระบบ</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Username หรือ Email">
              <Input
                type="text"
                placeholder="กรอก Username หรือ Email"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </Field>

            <Field label="รหัสผ่าน">
              <Input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </Field>

            {error && <p style={{ color: '#ba1a1a', fontSize: 13, margin: 0 }}>{error}</p>}

            <Button onClick={handleLogin} disabled={loading} fullWidth size="lg">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </div>

          <p style={{ marginTop: 32, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            Demo: กรอกข้อมูลจำลองเพื่อเข้าสู่ระบบ
          </p>
        </div>
      </div>
    </div>
  )
}
