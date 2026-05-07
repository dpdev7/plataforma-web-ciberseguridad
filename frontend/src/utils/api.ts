// Ya no apunta al backend directamente — usa el proxy de Vercel
export const API_BACKEND = import.meta.env.DEV 
  ? import.meta.env.VITE_API_URL_BACKEND  // http://localhost:8000
  : '/api';

let _token: string | null = null;
const getCache = new Map<string, Promise<unknown>>();

export function setAuthToken(token: string | null) {
  _token = token;
  getCache.clear();
}

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const method = options?.method?.toUpperCase() ?? 'GET';
  const isGet = method === 'GET';
  const cacheKey = `${_token ?? 'anon'}:${endpoint}`;

  if (isGet && getCache.has(cacheKey)) {
    return getCache.get(cacheKey);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  if (!isGet) {
    getCache.clear();
  }

  const request = fetch(`${API_BACKEND}${endpoint}`, {
    ...options,
    credentials: 'include',  // ← ahora funciona porque es mismo dominio
    headers,
  }).then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message ?? `Error ${res.status}`);
    }

    return data;
  });

  if (isGet) {
    getCache.set(cacheKey, request);
    request.catch(() => getCache.delete(cacheKey));
  }

  return request;
};

export const preloadApi = (endpoint: string) => apiFetch(endpoint);

export function invalidateApiCache(endpoint?: string) {
  if (!endpoint) {
    getCache.clear();
    return;
  }

  for (const key of getCache.keys()) {
    if (key.endsWith(`:${endpoint}`)) {
      getCache.delete(key);
    }
  }
}
