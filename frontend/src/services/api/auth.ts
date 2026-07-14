import client from "./client";

export interface User {
  id: number;
  organization_id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignupPayload {
  organization_code: string;
  organization_name: string;
  full_name: string;
  email: string;
  password: string;
}

function saveSession(token: Token): void {
  localStorage.setItem("access_token", token.access_token);
  localStorage.setItem("user", JSON.stringify(token.user));
}

export async function login(
  email: string,
  password: string
): Promise<Token> {
  // Backend expects OAuth2 form fields: username + password
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  const response = await client.post<Token>("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  saveSession(response.data);
  return response.data;
}

export async function signup(payload: SignupPayload): Promise<Token> {
  const response = await client.post<Token>("/auth/signup", payload);
  saveSession(response.data);
  return response.data;
}

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("access_token"));
}
