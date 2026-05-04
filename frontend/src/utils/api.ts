export const API_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

// Token en memoria — se setea desde AuthContext
let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const res = await fetch(`${API_BACKEND}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();  
  return data;                     
};