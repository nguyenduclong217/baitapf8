// User
export interface User {
  id: number;
  email: string;
  password: string;
  fullname: string;
}

// Regster
export interface RegisterResponse {
  email: string;
  password: string;
  fullname: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface infoUser {
  id: number;
  email: string;
  fullname: string;
}
