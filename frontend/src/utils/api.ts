// Ya no apunta al backend directamente — usa el proxy de Vercel
export const API_BACKEND =  import.meta.env.VITE_API_URL_BACKEND ?? "http://localhost:8000";

let _token: string | null = null;
const GET_CACHE_TTL_MS = 5000;
const getCache = new Map<string, { promise: Promise<unknown>; expiresAt: number }>();

export function setAuthToken(token: string | null) {
  _token = token;
  getCache.clear();
}

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const method = options?.method?.toUpperCase() ?? 'GET';
  const isGet = method === 'GET';
  const skipCache = options?.cache === 'no-store' || options?.cache === 'reload';
  const cacheKey = `${_token ?? 'anon'}:${endpoint}`;
  const cached = getCache.get(cacheKey);

  if (isGet && skipCache) {
    getCache.delete(cacheKey);
  }

  if (isGet && !skipCache && cached && cached.expiresAt > Date.now()) {
    return cached.promise;
  }

  if (isGet && cached) {
    getCache.delete(cacheKey);
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

  if (isGet && !skipCache) {
    getCache.set(cacheKey, {
      promise: request,
      expiresAt: Date.now() + GET_CACHE_TTL_MS,
    });
    request.catch(() => getCache.delete(cacheKey));
  }

  return request;
};

export const preloadApi = (endpoint: string, options?: RequestInit) =>
  apiFetch(endpoint, options);

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
