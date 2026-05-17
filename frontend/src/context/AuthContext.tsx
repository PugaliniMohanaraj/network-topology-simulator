import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/authApi";
import { getAuthToken, setAuthToken } from "../api/client";

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuth = useCallback((response: authApi.AuthResponse) => {
    setAuthToken(response.token);
    setUser({ id: response.userId, name: response.name, email: response.email });
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login(email, password);
      applyAuth(response);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authApi.register(name, email, password);
      applyAuth(response);
    },
    [applyAuth],
  );

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .fetchProfile()
      .then((profile) => setUser({ id: profile.id, name: profile.name, email: profile.email }))
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
