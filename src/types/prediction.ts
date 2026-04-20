export interface PredictionResult {
  index: number;
  default_probability: number;
  defaultProbability?: number;
  decision: string;
  decision_en: 'default_risk' | 'below_threshold';
  decisionEn?: 'default_risk' | 'below_threshold';
  risk_band: string;
  riskBand?: string;
  risk_band_en: 'low' | 'medium' | 'high';
  riskBandEn?: 'low' | 'medium' | 'high';
  threshold: number;
  request_id?: number;
  requestId?: number;
  score?: number;
  credit_score?: number;
  modelVersion?: string;
  model_version?: string;
}

export interface PredictionHistoryItem {
  id: number;
  created_at: string;
  createdAt?: string;
  model_version: string;
  modelVersion?: string;
  threshold: number;
  client_ip: string;
  clientIp?: string | null;
  predictions: PredictionResult[];
}

export interface PredictionsResponse {
  count: number;
  items: PredictionHistoryItem[];
}

export type PredictPayload =
  | Record<string, unknown>
  | Record<string, unknown>[];

export interface PredictRequest {
  payload: PredictPayload;
  threshold?: number;
}

export interface PredictResponse {
  predictions: PredictionResult[];
  model_version: string;
  modelVersion?: string;
}

export interface PredictionDetailResponse {
  id: number;
  createdAt?: string;
  created_at?: string;
  modelVersion?: string;
  model_version?: string;
  threshold: number;
  clientIp?: string | null;
  client_ip?: string | null;
  requestPayload?: Record<string, unknown> | { batch: Record<string, unknown>[] };
  request_payload?: Record<string, unknown> | { batch: Record<string, unknown>[] };
  translatedPayload?: Record<string, unknown>[];
  translated_payload?: Record<string, unknown>[];
  predictions: PredictionResult[];
}
