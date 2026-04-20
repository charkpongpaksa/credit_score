# 📗 คู่มือทดสอบ API แบบครบวงจร (API Test Playbook)
**ฉบับสมบูรณ์สำหรับ QA และทีมนักพัฒนา**

คู่มือนี้สรุป Endpoint ทั้งหมดของระบบ Credit Score Model พร้อมวิธีการทดสอบผ่าน Postman และ Checklist เพื่อตรวจสอบความถูกต้องของระบบทั้งส่วนของ Legacy API และ v1 API

---

## 🛠 1. การเตรียมสภาพแวดล้อม (Environment Setup)

### 1.1 ตั้งค่า Postman Environment Variables
สร้าง Environment ใน Postman และตั้งค่าตัวแปรดังนี้:
| Variable | Initial Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `http://127.0.0.1:8000` | Base URL ของ API Server |
| `adminEmail` | `admin@example.com` | อีเมลแอดมินสำหรับทดสอบ |
| `adminPassword` | `Admin1234!` | รหัสผ่านแอดมิน |
| `accessToken` | *(เว้นว่าง)* | โทเคนสำหรับการยืนยันตัวตน |
| `refreshToken` | *(เว้นว่าง)* | โทเคนสำหรับขอ Access Token ใหม่ |
| `assessmentId` | *(เว้นว่าง)* | ID ของใบคำขอสินเชื่อ |

### 1.2 สคริปต์อัตโนมัติสำหรับ Postman (Tests Script)
เพื่อให้การทดสอบลื่นไหล แนะนำให้ใส่ Script ต่อไปนี้ในแท็บ **Tests** ของ Request:

**สำหรับ Login API (`POST /api/v1/auth/login`):**
```javascript
const json = pm.response.json();
if (json.success && json.data) {
    pm.environment.set("accessToken", json.data.accessToken);
    pm.environment.set("refreshToken", json.data.refreshToken);
}
```

**สำหรับ Create Assessment (`POST /api/v1/assessments`):**
```javascript
const json = pm.response.json();
if (json.success && json.data) {
    pm.environment.set("assessmentId", json.data.assessmentId);
}
```

---

## 🧪 2. Checklist การทดสอบ API (Endpoint Matrix)

### 📌 หมวด A: Legacy & Public Health
เส้นเหล่านี้ไม่ต้องใช้ Auth Token

- [ ] `GET /health` : คืนค่า `{"status":"ok"}`
- [ ] `GET /db-health` : คืนค่า `{"db_connected": true}`
- [ ] `GET /api/v1/health` : คืนค่า `{ "success": true, "message": "OK", ... }`
- [ ] `GET /api/v1/db-health` : คืนค่า status การเชื่อมต่อ DB

### 📌 หมวด B: Authentication (`/api/v1/auth/*`)
- [ ] `POST /api/v1/auth/login` : ใส่ Email/Password แอดมิน -> ต้องได้ Token
- [ ] `GET /api/v1/auth/me` : ใช้ Token -> ต้องได้ข้อมูล Profile กลับมา
- [ ] `POST /api/v1/auth/refresh` : ใช้ Refresh Token -> ต้องได้ Token ชุดใหม่
- [ ] `POST /api/v1/auth/logout` : สั่ง Revoke Token เดิม

### 📌 หมวด C: Model Data & Prediction
- [ ] `GET /api/v1/model-info` : คืนค่าข้อมูล Metrics และ Feature Counts
- [ ] `GET /api/v1/input-catalog` : คืนค่าคำอธิบายตัวแปรจากไฟล์ JSON
- [ ] `GET /api/v1/input-summary` : คืนค่าสรุปจำนวน Field ที่ต้องส่ง
- [ ] `POST /predict` (Legacy) : ยิง Payload 19 ตัวแปร -> ต้องได้ Decision ออกมาทันที
- [ ] `POST /api/v1/predict` : ยิง Payload แบบเดียวกันผ่าน v1 -> ต้องได้โครงสร้างแบบ Envelope

### 📌 หมวด D: Assessment Workflow (`/api/v1/assessments`)
หมวดนี้คือหัวใจสำคัญของการทำงานระบบใหม่ (Flow หลัก)
- [ ] `GET /api/v1/assessments/form-options` : โหลดตัวเลือกต่างๆ สำหรับทำ Dropdown
- [ ] `POST /api/v1/assessments` : สร้าง Draft ใบคำขอใหม่ -> ต้องได้ `assessmentId` กลับมา
- [ ] `PUT /api/v1/assessments/{{assessmentId}}` : อัปเดตข้อมูล Draft -> สถานะเปลี่ยนเป็น IN_PROGRESS
- [ ] `POST /api/v1/assessments/calculate` : ยิง Payload คำนวณเบื้องต้น (Preview) โดยไม่บันทึก History
- [ ] `POST /api/v1/assessments/{{assessmentId}}/submit` : กดส่งผลขั้นสุดท้าย -> สถานะเป็น COMPLETED และสร้าง Risk Result ลง DB
- [ ] `GET /api/v1/assessments/{{assessmentId}}/detail` : อ่านข้อมูลใบคำขอพร้อมผลลัพธ์ย้อนหลังทั้งหมด
- [ ] `GET /api/v1/assessments` : ดูรายการประวัติทั้งหมด (รองรับ Pagination, Sort, Filter)

### 📌 หมวด E: Dashboard & Admin
- [ ] `GET /api/v1/dashboard/summary` : สรุปตัวเลขสถิติรวมของระบบ
- [ ] `GET /api/v1/dashboard/risk-distribution` : กราฟแจกแจงระดับความเสี่ยง
- [ ] `GET /api/v1/admin/users` : แสดงรายชื่อผู้ใช้งานระบบ (ต้องสิทธิ์ ADMIN)

---

## 🎯 3. โครงสร้าง Payload ที่ใช้บ่อย (Mock Payload)

### Payload สำหรับ `POST /api/v1/predict`
```json
{
  "threshold": 0.5,
  "payload": {
    "รหัสลูกค้า": 910001,
    "ประเภทสินเชื่อ": "Cash loans",
    "เพศ": "F",
    "มีรถยนต์": "N",
    "มีอสังหาริมทรัพย์": "Y",
    "จำนวนบุตร": 1,
    "รายได้รวม": 300000,
    "วงเงินสินเชื่อ": 450000,
    "ค่างวดรายงวด": 23000,
    "ราคาสินค้า": 430000,
    "ประเภทอาชีพรายได้": "Working",
    "ระดับการศึกษา": "Higher education",
    "สถานภาพครอบครัว": "Married",
    "ประเภทที่อยู่อาศัย": "House / apartment",
    "อายุวันเกิด": -14000,
    "อายุงานวัน": -2800,
    "จำนวนสมาชิกครอบครัว": 3,
    "คะแนนภายนอก2": 0.61,
    "คะแนนภายนอก3": 0.47
  }
}
```

## 🔄 4. คำแนะนำการเชื่อมต่อ Frontend (Integration Notes)
1. **การดักจับข้อผิดพลาด (Error Handling):** 
   - ระบบ v1 จะตอบกลับข้อผิดพลาดในรูปแบบ `{"success": false, "errorCode": "...", "message": "..."}` เสมอ สามารถเขียน Axios Interceptor เพื่อจับ error และแสดง Toast ได้ง่ายขึ้น
2. **การทำงานร่วมกับ Next.js API Routes:** 
   - ตั้งค่า `rewrites()` ใน `next.config.js` ให้ proxy `/api/:path*` ไปหา `http://127.0.0.1:8000/:path*` เพื่อหลีกเลี่ยงปัญหา CORS
3. **ฟอร์มการประเมิน (Assessment Form):**
   - ควรใช้ Endpoint ชุด `/api/v1/assessments/*` เพื่อบันทึกข้อมูลเข้าฐานข้อมูลจริง (มีประวัติและ History Log สมบูรณ์) แตกต่างจาก `/predict` เดิมที่เป็นเพียงการอนุมานผลชั่วคราว
