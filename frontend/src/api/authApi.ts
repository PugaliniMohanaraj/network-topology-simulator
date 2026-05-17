import { apiClient } from "./client";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  message: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>("/api/auth/me");
  return data;
}
