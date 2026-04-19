/**
 * Minimum Set Payload (44 Attributes)
 * Based on Frontend Payload Spec (TH/EN)
 */
export const DEFAULT_PAYLOAD = {
  SK_ID_CURR: 999999,
  NAME_CONTRACT_TYPE: "Cash loans",
  CODE_GENDER: "F",
  FLAG_OWN_CAR: "N",
  FLAG_OWN_REALTY: "Y",
  CNT_CHILDREN: 1,
  AMT_INCOME_TOTAL: 180000,
  AMT_CREDIT: 450000,
  AMT_ANNUITY: 23000,
  AMT_GOODS_PRICE: 450000,
  NAME_TYPE_SUITE: "Unaccompanied",
  NAME_INCOME_TYPE: "Working",
  NAME_EDUCATION_TYPE: "Higher education",
  NAME_FAMILY_STATUS: "Married",
  NAME_HOUSING_TYPE: "House / apartment",
  REGION_POPULATION_RELATIVE: 0.0188,
  DAYS_BIRTH: -14000,
  DAYS_EMPLOYED: -3000,
  DAYS_REGISTRATION: -4000,
  DAYS_ID_PUBLISH: -2000,
  OWN_CAR_AGE: 5,
  FLAG_MOBIL: 1,
  FLAG_EMP_PHONE: 1,
  FLAG_WORK_PHONE: 0,
  FLAG_CONT_MOBILE: 1,
  FLAG_PHONE: 1,
  FLAG_EMAIL: 0,
  OCCUPATION_TYPE: "Laborers",
  CNT_FAM_MEMBERS: 3,
  REGION_RATING_CLIENT: 2,
  REGION_RATING_CLIENT_W_CITY: 2,
  WEEKDAY_APPR_PROCESS_START: "WEDNESDAY",
  HOUR_APPR_PROCESS_START: 10,
  ORGANIZATION_TYPE: "Business Entity Type 3",
  EXT_SOURCE_1: 0.72,
  EXT_SOURCE_2: 0.63,
  EXT_SOURCE_3: 0.51,
  OBS_30_CNT_SOCIAL_CIRCLE: 2,
  DEF_30_CNT_SOCIAL_CIRCLE: 0,
  OBS_60_CNT_SOCIAL_CIRCLE: 2,
  DEF_60_CNT_SOCIAL_CIRCLE: 0,
  DAYS_LAST_PHONE_CHANGE: -1000,
  AMT_REQ_CREDIT_BUREAU_MON: 0,
  AMT_REQ_CREDIT_BUREAU_YEAR: 1
}

export const OPTIONS = {
  CONTRACT_TYPE: ["Cash loans", "Revolving loans"],
  GENDER: [
    { value: 'F', label: 'Female (หญิง)' },
    { value: 'M', label: 'Male (ชาย)' }
  ],
  YES_NO: [
    { value: 'Y', label: 'Yes (มี)' },
    { value: 'N', label: 'No (ไม่มี)' }
  ],
  BOOLEAN_INT: [
    { value: 1, label: 'Yes (ใช่)' },
    { value: 0, label: 'No (ไม่ใช่)' }
  ],
  TYPE_SUITE: ["Unaccompanied", "Family", "Children", "Spouse, partner", "Other_A", "Other_B", "Group of people"],
  INCOME_TYPE: ["Working", "Commercial associate", "Pensioner", "State servant", "Businessman", "Student", "Unemployed"],
  EDUCATION_TYPE: ["Higher education", "Secondary / secondary special", "Incomplete higher", "Lower secondary", "Academic degree"],
  FAMILY_STATUS: ["Married", "Single / not married", "Civil marriage", "Separated", "Widow"],
  HOUSING_TYPE: ["House / apartment", "Rented apartment", "With parents", "Municipal apartment", "Office apartment", "Co-op apartment"],
  OCCUPATION_TYPE: ["Laborers", "Sales staff", "Core staff", "Managers", "Drivers", "Accountants", "Medicine staff", "Security staff", "Cleaning staff", "Cooking staff", "Private service staff", "High skill tech staff", "IT staff", "HR staff", "Secretaries", "Waiters/barmen staff", "Realty agents", "Low-skill Laborers"],
  WEEKDAY: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  ORGANIZATION_TYPE: ["Business Entity Type 1", "Business Entity Type 2", "Business Entity Type 3", "Government", "Self-employed", "School", "Trade: type 1", "Trade: type 2", "Trade: type 3", "Trade: type 4", "Trade: type 5", "Trade: type 6", "Trade: type 7", "Industry: type 1", "Industry: type 2", "Industry: type 3", "Industry: type 4", "Industry: type 5", "Industry: type 6", "Industry: type 7", "Industry: type 8", "Industry: type 9", "Industry: type 10", "Industry: type 11", "Industry: type 12", "Industry: type 13", "Medicine", "Bank", "Construction", "Transport: type 1", "Transport: type 2", "Transport: type 3", "Transport: type 4", "Housing", "Military", "Police", "Security", "Services", "Telecom", "Hotel", "Restaurant", "University", "Other"],
  RATING: [
    { value: 1, label: 'Rating 1 (ต่ำ)' },
    { value: 2, label: 'Rating 2 (กลาง)' },
    { value: 3, label: 'Rating 3 (สูง)' }
  ]
}
