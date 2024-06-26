import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { jwtDecode } from 'jwt-decode';

export type UserData = {
  id: number;
  username: string;
  iat: number;
  exp: number;
};

export interface AuthContextType {
  currentUser: UserData | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user: UserData = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (user.exp < currentTime) {
        localStorage.clear();
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
    }
  }, []);

  const register = async (username: string, password: string) => {
    const response = await fetch('auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Account creation failed');
    const { token } = await response.json();
    localStorage.setItem('token', token);

    // TODO: handle default user settings creation

    setCurrentUser(jwtDecode(token));
  };

  const login = async (username: string, password: string) => {
    const authResponse = await fetch('auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!authResponse.ok) throw new Error('Login failed');

    const { token } = await authResponse.json();

    const user: UserData = jwtDecode(token);

    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
