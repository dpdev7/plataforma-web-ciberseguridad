export const API_BACKEND = "https://backend-web-ciberseguridad.onrender.com";

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${API_BACKEND}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  return res.json();
};