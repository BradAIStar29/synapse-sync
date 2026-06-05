import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  email: string;
  workspaceName: string;
  hasCompletedOnboarding: boolean;
  connectedPlatforms: string[];
  brandTone: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, workspaceName: string) => Promise<boolean>;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => void;
  connectPlatform: (platformId: string) => void;
  disconnectPlatform: (platformId: string) => void;
  updateBrandTone: (tone: string) => void;
  completeOnboarding: () => void;
  updateWorkspaceName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default users list for login tests
const DEFAULT_USERS = [
  {
    email: "agency@synapse.com",
    password: "password123",
    workspaceName: "Acme Content Agency",
    hasCompletedOnboarding: true,
    connectedPlatforms: ["linkedin", "x"],
    brandTone: "thought-leader"
  },
  {
    email: "creator@synapse.com",
    password: "password123",
    workspaceName: "Minds Unleashed Studio",
    hasCompletedOnboarding: false,
    connectedPlatforms: [],
    brandTone: "viral-growth"
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Bootstrap users DB in localStorage if it doesn't exist
    if (!localStorage.getItem('synapse_users_db')) {
      localStorage.setItem('synapse_users_db', JSON.stringify(DEFAULT_USERS));
    }

    // Check active session
    const activeSession = localStorage.getItem('synapse_active_session');
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        localStorage.removeItem('synapse_active_session');
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (session: UserSession | null) => {
    setUser(session);
    if (session) {
      localStorage.setItem('synapse_active_session', JSON.stringify(session));
      // Also update the database record
      const dbStr = localStorage.getItem('synapse_users_db');
      if (dbStr) {
        const db = JSON.parse(dbStr);
        const idx = db.findIndex((u: any) => u.email.toLowerCase() === session.email.toLowerCase());
        if (idx !== -1) {
          db[idx] = { ...db[idx], ...session };
          localStorage.setItem('synapse_users_db', JSON.stringify(db));
        }
      }
    } else {
      localStorage.removeItem('synapse_active_session');
    }
  };

  const signUp = async (email: string, password: string, workspaceName: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !password || !workspaceName) {
        setError("All fields are required.");
        setIsLoading(false);
        return false;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return false;
      }

      const dbStr = localStorage.getItem('synapse_users_db') || '[]';
      const db = JSON.parse(dbStr);

      const exists = db.some((u: any) => u.email.toLowerCase() === trimmedEmail);
      if (exists) {
        setError("An account with this email already exists.");
        setIsLoading(false);
        return false;
      }

      const newUserRecord = {
        email: trimmedEmail,
        password,
        workspaceName,
        hasCompletedOnboarding: false,
        connectedPlatforms: [],
        brandTone: "balanced"
      };

      db.push(newUserRecord);
      localStorage.setItem('synapse_users_db', JSON.stringify(db));

      const session: UserSession = {
        email: trimmedEmail,
        workspaceName,
        hasCompletedOnboarding: false,
        connectedPlatforms: [],
        brandTone: "balanced"
      };

      saveSession(session);
      setIsLoading(false);
      return true;
    } catch (e) {
      setError("An unexpected error occurred during signup.");
      setIsLoading(false);
      return false;
    }
  };

  const logIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !password) {
        setError("Please enter both email and password.");
        setIsLoading(false);
        return false;
      }

      const dbStr = localStorage.getItem('synapse_users_db') || '[]';
      const db = JSON.parse(dbStr);

      const matchedUser = db.find((u: any) => u.email.toLowerCase() === trimmedEmail && u.password === password);
      
      if (!matchedUser) {
        setError("Invalid email address or passcode.");
        setIsLoading(false);
        return false;
      }

      const session: UserSession = {
        email: matchedUser.email,
        workspaceName: matchedUser.workspaceName,
        hasCompletedOnboarding: matchedUser.hasCompletedOnboarding,
        connectedPlatforms: matchedUser.connectedPlatforms || [],
        brandTone: matchedUser.brandTone || "balanced"
      };

      saveSession(session);
      setIsLoading(false);
      return true;
    } catch (e) {
      setError("An unexpected error occurred during login.");
      setIsLoading(false);
      return false;
    }
  };

  const logOut = () => {
    saveSession(null);
  };

  const connectPlatform = (platformId: string) => {
    if (!user) return;
    const updatedPlatforms = user.connectedPlatforms.includes(platformId)
      ? user.connectedPlatforms
      : [...user.connectedPlatforms, platformId];
    
    saveSession({
      ...user,
      connectedPlatforms: updatedPlatforms
    });
  };

  const disconnectPlatform = (platformId: string) => {
    if (!user) return;
    saveSession({
      ...user,
      connectedPlatforms: user.connectedPlatforms.filter(id => id !== platformId)
    });
  };

  const updateBrandTone = (tone: string) => {
    if (!user) return;
    saveSession({
      ...user,
      brandTone: tone
    });
  };

  const completeOnboarding = () => {
    if (!user) return;
    saveSession({
      ...user,
      hasCompletedOnboarding: true
    });
  };

  const updateWorkspaceName = (name: string) => {
    if (!user) return;
    saveSession({
      ...user,
      workspaceName: name
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      signUp,
      logIn,
      logOut,
      connectPlatform,
      disconnectPlatform,
      updateBrandTone,
      completeOnboarding,
      updateWorkspaceName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
