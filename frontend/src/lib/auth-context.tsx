'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  avatarInitial: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'pneumovision_users';
const SESSION_KEY = 'pneumovision_session';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): Record<string, { name: string; email: string; passwordHash: string; joinDate: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: ReturnType<typeof getUsers>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];
    if (!userRecord) {
      return { success: false, error: 'No account found with this email.' };
    }
    const hash = await hashPassword(password);
    if (hash !== userRecord.passwordHash) {
      return { success: false, error: 'Incorrect password.' };
    }
    const sessionUser: User = {
      name: userRecord.name,
      email: userRecord.email,
      avatarInitial: userRecord.name.charAt(0).toUpperCase(),
      joinDate: userRecord.joinDate,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const passwordHash = await hashPassword(password);
    const joinDate = new Date().toISOString();
    users[key] = { name, email: key, passwordHash, joinDate };
    saveUsers(users);
    const sessionUser: User = {
      name,
      email: key,
      avatarInitial: name.charAt(0).toUpperCase(),
      joinDate,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isInitialized, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
