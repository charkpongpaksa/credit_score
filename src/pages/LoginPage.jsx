import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if (!form.username || !form.password) { setError('กรุณากรอกข้อมูลให้ครบถ้วน'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 800)
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
        {/* Left panel */}
        <div style={{
          width: '45%', padding: 48,
          background: 'linear-gradient(135deg,#004ac6 0%,#2563eb 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -50, left: -50, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          }} />
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
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['โมเดล ML ประเมินความเสี่ยงอัตโนมัติ', 'คะแนนเครดิต 300–850 (FICO-based)', 'รายงานปัจจัยเสี่ยงเชิงลึก'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined icon-fill" style={{ color: '#7ffc97', fontSize: 18 }}>check_circle</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#171c1f' }}>เข้าสู่ระบบ</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#434655', marginBottom: 8 }}>
                Username หรือ Email
              </label>
              <input
                type="text" placeholder="กรอก Username หรือ Email"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#434655' }}>รหัสผ่าน</label>
                <a href="#" style={{ fontSize: 13, color: '#004ac6', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              <input
                type="password" placeholder="กรอกรหัสผ่าน"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && <p style={{ color: '#ba1a1a', fontSize: 13, margin: 0 }}>{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                padding: '13px 24px', borderRadius: 12, border: 'none',
                background: loading ? '#93a5c4' : 'linear-gradient(135deg,#004ac6,#2563eb)',
                color: '#fff', fontWeight: 600, fontSize: 15,
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Prompt, sans-serif', marginTop: 8,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>

          <p style={{ marginTop: 32, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            Demo: กรอก username และ password อะไรก็ได้
          </p>
        </div>
      </div>
    </div>
  )
}
