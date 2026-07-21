import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@MindBlog:token');
  });

  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    localStorage.setItem('@MindBlog:token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('@MindBlog:token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
