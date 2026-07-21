import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatar?: string | null;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@MindBlog:token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('@MindBlog:user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    // Dados padrão para simulação quando logado sem foto
    return token ? { name: 'John Doe', email: 'johndoe@email.com', avatar: null } : null;
  });

  const isAuthenticated = !!token;

  const login = (newToken: string, newUser?: User) => {
    const userData = newUser || { name: 'John Doe', email: 'johndoe@email.com', avatar: null };
    localStorage.setItem('@MindBlog:token', newToken);
    localStorage.setItem('@MindBlog:user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('@MindBlog:token');
    localStorage.removeItem('@MindBlog:user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
