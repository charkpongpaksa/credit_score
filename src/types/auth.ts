export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginValues {
  email: string;
  password?: string;
}
