export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
