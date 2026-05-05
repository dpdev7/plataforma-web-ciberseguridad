// Ya no apunta al backend directamente — usa el proxy de Vercel
export const API_BACKEND = import.meta.env.DEV 
  ? import.meta.env.VITE_API_URL_BACKEND  // http://localhost:8000
  : '/api';

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
    credentials: 'include',  // ← ahora funciona porque es mismo dominio
    headers,
  });

  return res.json();
};