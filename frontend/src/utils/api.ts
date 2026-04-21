export const API_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include', // importante para enviar la cookie auth_token
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  return res.json();
};