type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  data?: T
}

export function extractApiData<T>(payload: ApiEnvelope<T> | T): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    'data' in payload
  ) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}
