// Auth TypeScript types for local JWT-based authentication

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface UserInfoResponse {
  openId: string;
  name: string;
  email?: string | null;
  loginMethod?: string | null;
}
