import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import authService from '../services/authService';
import { TOKEN_STORAGE_KEY, setUnauthorizedHandler } from '../services/api';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  // Sin token guardado no hay sesión que revalidar, así que no arranca cargando.
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Refs para que el handler del 401 lea la sesión y la ruta actuales sin registrarse de nuevo.
  const sessionUserRef = useRef(null);
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionUserRef.current = null;
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return undefined;
    }

    let ignore = false;

    authService
      .getMe()
      .then((data) => {
        if (ignore) return;
        sessionUserRef.current = data.user;
        setUser(data.user);
      })
      .catch((error) => {
        if (!ignore && error.status === 401) {
          clearSession();
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      // Solo se redirige si había una sesión activa; un token viejo al cargar la app se limpia sin sacar al usuario de la página.
      const hadSession = Boolean(sessionUserRef.current);
      clearSession();

      if (hadSession) {
        navigate('/login', {
          state: { reason: 'session-expired', from: locationRef.current },
        });
      }
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    sessionUserRef.current = data.user;
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    navigate('/');
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      loading,
      login,
      logout,
      register,
    }),
    [user, token, loading, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
