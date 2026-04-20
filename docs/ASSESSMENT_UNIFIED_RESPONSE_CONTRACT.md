# Assessment Unified Response Contract

เอกสารนี้กำหนด **Response Contract กลาง 1 ชุด** สำหรับ endpoint:

1. `POST /api/v1/assessments/calculate`
2. `POST /api/v1/assessments/{assessmentId}/submit`
3. `POST /api/v1/assessments/{assessmentId}/re-evaluate`

เป้าหมายคือให้ frontend ใช้ parser ชุดเดียวได้ และผล `calculate` ตรงกับ `submit/re-evaluate` 100%

---

## 1) Envelope กลาง (ทุก endpoint ใช้เหมือนกัน)

### Success

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "VALIDATION_ERROR",
  "errorCode": "INVALID_INPUT",
  "errors": [
    {
      "field": "employmentInfo.occupationCode",
      "message": "Unknown occupation code"
    }
  ]
}
```

---

## 2) Canonical `data` Schema (ใช้ร่วมกันทั้ง 3 เส้น)

```json
{
  "assessmentId": "uuid-or-null",
  "assessmentNo": "CR-2026-000039",
  "mode": "PREVIEW|SUBMITTED|RE_EVALUATED",
  "calculatedAt": "2026-04-20T14:45:43.132388+00:00",
  "savedAt": "2026-04-20T14:46:10.000000+00:00",
  "result": {
    "resultId": "uuid-or-null",
    "score": 60.0,
    "scoreScale": 100,
    "creditScore": 620,
    "scoreGrade": "C",
    "defaultProbability": 0.4,
    "riskLevel": "MEDIUM",
    "recommendationType": "REVIEW_MANUAL",
    "primaryReason": "ภาระหนี้ต่อรายได้สูงและอายุงานสั้น"
  },
  "scoreBreakdown": [
    {
      "code": "DTI_HIGH",
      "labelTh": "ภาระหนี้ต่อรายได้สูง",
      "labelEn": "High debt-to-income ratio",
      "value": 0.64,
      "scoreDelta": -20.0,
      "detail": "DTI = 0.64"
    }
  ],
  "riskFactors": [
    {
      "code": "DTI_HIGH",
      "labelTh": "ภาระหนี้ต่อรายได้สูง",
      "impactDirection": "NEGATIVE",
      "impactScore": 20.0,
      "detail": "ภาระหนี้ต่อรายได้สูง"
    }
  ],
  "recommendations": [
    {
      "type": "REVIEW_MANUAL",
      "titleTh": "คำแนะนำหลัก",
      "descriptionTh": "ควรตรวจสอบเอกสารรายได้เพิ่มเติม",
      "priority": 1,
      "isPrimary": true
    }
  ],
  "inputSnapshot": {
    "applicantProfile": {},
    "employmentInfo": {},
    "financialInfo": {},
    "debtInfos": []
  },
  "model": {
    "name": "credit-risk-model",
    "version": "v1.0.0",
    "threshold": 0.5
  },
  "trace": {
    "requestId": "optional-string-or-number",
    "source": "calculate_risk"
  }
}
```

---

## 3) ความต่างตาม endpoint

### `POST /api/v1/assessments/calculate`

1. `mode = "PREVIEW"`
2. `assessmentId` อาจ `null` ได้
3. `savedAt = null`
4. `result.resultId = null`
5. ที่เหลือใช้ schema เดียวกันทั้งหมด

### `POST /api/v1/assessments/{assessmentId}/submit`

1. `mode = "SUBMITTED"`
2. `assessmentId` ต้องไม่เป็น `null`
3. `savedAt` ต้องมีค่า
4. `result.resultId` ต้องมีค่า (id ใน DB)
5. ค่าใน `result/scoreBreakdown/riskFactors/recommendations` ต้องตรงกับ calculate เมื่อ input เดียวกัน

### `POST /api/v1/assessments/{assessmentId}/re-evaluate`

1. `mode = "RE_EVALUATED"`
2. `assessmentId` ต้องไม่เป็น `null`
3. `savedAt` ต้องมีค่า
4. `result.resultId` เป็น id ของรอบประเมินใหม่
5. ต้องบันทึก `riskFactors` และ `recommendations` ลง DB เช่นเดียวกับ submit

---

## 4) Invariants (กฎที่ต้องจริงเสมอ)

1. `result` ต้องมาจาก source เดียวกับ `scoreBreakdown/riskFactors/recommendations`
2. ห้ามส่งข้อมูลคนละ source ใน response เดียวกัน
3. ห้ามให้ field duplicate แบบต่าง naming ใน canonical response เดียวกัน
4. ห้ามส่งค่า static demo ใน production response
5. ถ้า derive คะแนนจาก breakdown ต้องสอดคล้อง:

```text
result.score = baseScore + sum(scoreBreakdown[].scoreDelta)
```

6. ถ้า `scoreScale = 100` then `0 <= score <= 100`
7. ถ้า `creditScore` ใช้สเกล 300-850 ให้ map แบบ deterministic จาก `score`

---

## 5) Recommended Types (Backend)

```python
from typing import Literal, Optional, List, Dict, Any
from pydantic import BaseModel

Mode = Literal["PREVIEW", "SUBMITTED", "RE_EVALUATED"]
RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]
RecommendationType = Literal["APPROVE", "REJECT", "REVIEW", "REVIEW_MANUAL", "INFO"]
ImpactDirection = Literal["POSITIVE", "NEGATIVE", "NEUTRAL"]

class ResultModel(BaseModel):
    resultId: Optional[str] = None
    score: float
    scoreScale: int = 100
    creditScore: int
    scoreGrade: str
    defaultProbability: float
    riskLevel: RiskLevel
    recommendationType: RecommendationType
    primaryReason: str

class ScoreBreakdownItem(BaseModel):
    code: str
    labelTh: str
    labelEn: Optional[str] = None
    value: Optional[float] = None
    scoreDelta: float
    detail: Optional[str] = None

class RiskFactorItem(BaseModel):
    code: str
    labelTh: str
    impactDirection: ImpactDirection
    impactScore: float
    detail: Optional[str] = None

class RecommendationItem(BaseModel):
    type: RecommendationType
    titleTh: str
    descriptionTh: str
    priority: int
    isPrimary: bool

class UnifiedAssessmentResponseData(BaseModel):
    assessmentId: Optional[str] = None
    assessmentNo: Optional[str] = None
    mode: Mode
    calculatedAt: str
    savedAt: Optional[str] = None
    result: ResultModel
    scoreBreakdown: List[ScoreBreakdownItem]
    riskFactors: List[RiskFactorItem]
    recommendations: List[RecommendationItem]
    inputSnapshot: Dict[str, Any]
    model: Dict[str, Any]
    trace: Dict[str, Any]
```

---

## 6) Integration Pattern (Backend)

แนะนำให้รวม logic ประเมินไว้ service เดียว เช่น:

```text
evaluate_assessment(payload_or_assessment_id) -> UnifiedAssessmentResponseData
```

แล้วทั้ง 3 endpoint เรียก service นี้:

1. `calculate`: evaluate แล้ว return PREVIEW
2. `submit`: evaluate -> persist result/factors/recommendations -> return SUBMITTED
3. `re-evaluate`: evaluate -> persist version ใหม่ -> return RE_EVALUATED

---

## 7) Acceptance Tests (ต้องผ่านก่อน merge)

### A. Consistency Test

Given input ชุดเดียวกัน:

1. `calculate`
2. `submit`

ต้องเท่ากันใน field:

1. `result.score`
2. `result.creditScore`
3. `result.defaultProbability`
4. `result.riskLevel`
5. `result.recommendationType`
6. `scoreBreakdown[*].code/scoreDelta`
7. `riskFactors[*].code/impactDirection/impactScore`
8. `recommendations[*].type/priority/isPrimary`

### B. Persistence Test

หลัง `submit` และ `re-evaluate`:

1. `GET /api/v1/assessments/{id}/result`
2. `GET /api/v1/assessments/{id}/risk-factors`
3. `GET /api/v1/assessments/{id}/recommendations`
4. `GET /api/v1/assessments/{id}/detail`

ต้องสะท้อนข้อมูลชุดเดียวกับ response ล่าสุดของ submit/re-evaluate

### C. Non-static Test

เมื่อเปลี่ยน payload ที่กระทบ DTI/รายได้/default:

1. `scoreBreakdown` ต้องเปลี่ยนตาม
2. `riskFactors` ต้องเปลี่ยนตาม
3. `result.riskLevel` ต้องเปลี่ยนตาม

ห้ามค้างค่าเดิมจาก static template

---

## 8) Migration Checklist

1. เลิกส่ง field legacy ซ้อนกับ canonical ใน response เดียว
2. รวม mapping logic ทุก endpoint เข้า service เดียว
3. เพิ่ม unit tests สำหรับ `evaluate_assessment`
4. เพิ่ม contract tests สำหรับ 3 endpoints เทียบ field เท่ากัน
5. แจ้ง frontend ให้ใช้เฉพาะ:
   1. `data.result`
   2. `data.scoreBreakdown`
   3. `data.riskFactors`
   4. `data.recommendations`

---

## 9) FE Consumption (สั้น)

Frontend ควรใช้ parser เดียว:

1. `const r = res.data.result`
2. render score/risk จาก `r`
3. render table จาก `res.data.scoreBreakdown`
4. render factors จาก `res.data.riskFactors`
5. render recommendation cards จาก `res.data.recommendations`

ถ้า backend ทำตามสเปกนี้ หน้า preview หลัง calculate จะตรงกับหน้าหลัง submit/detail โดยไม่ต้องแยก parser หรือใส่ fallback ซับซ้อนฝั่ง frontend

