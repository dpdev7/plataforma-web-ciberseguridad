export const API_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

// Renueva el access token usando el refresh token (cookie httpOnly)
async function renovarToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BACKEND}/token/refresh/`, {
      method:      'POST',
      credentials: 'include',  // ← envía la cookie httpOnly
    });
    if (!res.ok) return null;
    const data = await res.json();
    _token = data.token;
    return data.token;
  } catch {
    return null;
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
    credentials: 'include',  // ← necesario para enviar la cookie en cada request
    headers,
  });

  // Si el access token expiró, intenta renovarlo automáticamente
  if (res.status === 401) {
    const newToken = await renovarToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      const retry = await fetch(`${API_BACKEND}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
      });
      return retry.json();
    }
  }

  return res.json();
};