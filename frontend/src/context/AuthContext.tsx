import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAuthToken } from '../utils/api';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  es_administrador: boolean;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token,   setToken]   = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app intenta renovar el token con la cookie httpOnly
useEffect(() => {
  const init = async () => {
    try {
      const res = await fetch('/api/token/refresh/', {
        method:      'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        
        // Primero setea el token
        setAuthToken(data.token);
        
        // Luego llama /me/ con el token directamente en el header
        const me = await fetch('/api/usuario/me/', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${data.token}` },  // ← token directo
        });

        if (me.ok) {
          const meData = await me.json();
          if (meData.authenticated) {
            setToken(data.token);
            setUsuario(meData.usuario);
          }
        }
      }
    } catch {
      // Sin sesión activa
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);
  const login = useCallback((token: string, usuario: Usuario) => {
    setToken(token);
    setUsuario(usuario);
    setAuthToken(token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      usuario,
      login,
      logout,
      isAuthenticated: !!token,
      isAdmin: !!usuario?.es_administrador,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}