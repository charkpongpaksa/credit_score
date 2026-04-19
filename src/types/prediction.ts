export interface PredictionResult {
  index: number;
  default_probability: number;
  decision: string;
  decision_en: 'default_risk' | 'below_threshold';
  risk_band: string;
  risk_band_en: 'low' | 'medium' | 'high';
  threshold: number;
  request_id?: number;
}

export interface PredictionHistoryItem {
  id: number;
  created_at: string;
  model_version: string;
  threshold: number;
  client_ip: string;
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
}
