export interface HealthResponse {
  status: string;
}

export interface DbHealthResponse {
  db_connected: boolean;
}

export interface ModelInfoResponse {
  model_version: string;
  metrics: Record<string, unknown>;
  num_raw_fields: number;
  num_model_features: number;
  num_raw_numeric_fields: number;
  num_raw_categorical_fields: number;
}
