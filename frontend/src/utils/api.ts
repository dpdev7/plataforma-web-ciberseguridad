export const API_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

let _token: string | null = localStorage.getItem('auth_token');

export function setAuthToken(token: string | null) {
  _token = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
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

  return res.json();
};