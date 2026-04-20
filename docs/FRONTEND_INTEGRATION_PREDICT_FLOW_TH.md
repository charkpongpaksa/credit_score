# Frontend Integration: Predict-First Flow (TH)

## Flow หลัก
1. ส่งฟอร์มไป `POST /api/v1/predict`
2. อ่าน `requestId` จาก `data.predictions[0].requestId`
3. เปิดหน้า detail ด้วย `GET /api/v1/predictions/{requestId}`
4. หน้า history ใช้ `GET /api/v1/predictions?limit=...`

> หมายเหตุ: `/api/v1/predict` ไม่มี `assessmentId`

## Response ฟิลด์หลักที่ UI ใช้
- `defaultProbability`
- `decision`, `decisionEn`
- `riskBand`, `riskBandEn`
- `threshold`
- `requestId`

## Error handling ที่แนะนำ
- `401`: refresh/login ใหม่
- `403`: role ไม่พอ
- `404`: prediction id ไม่พบ
- `422`: payload validation ไม่ผ่าน

## Header ที่ต้องใช้
- `Content-Type: application/json; charset=utf-8`
- `Authorization: Bearer <accessToken>`

