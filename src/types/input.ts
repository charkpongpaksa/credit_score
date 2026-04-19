export interface InputTemplate {
  [key: string]: unknown;
}

export interface InputCatalog {
  fields: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}

export interface InputSummary {
  total_fields: number;
  missing_fields_allowed: boolean;
}
