import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  logoutSession,
  refreshSession,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();

      setUser(data.user ?? data);
      return data.user ?? data;
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }

      try {
        await refreshSession();

        const refreshedData = await getCurrentUser();
        const refreshedUser =
          refreshedData.user ?? refreshedData;

        setUser(refreshedUser);
        return refreshedUser;
      } catch {
        setUser(null);
        return null;
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const restoredUser = await loadCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(restoredUser);
      } catch (error) {
        if (isMounted) {
          console.error(
            "Unable to restore authentication:",
            error
          );

          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [loadCurrentUser]);

  const login = useCallback((authenticatedUser) => {
    setUser(authenticatedUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      setUser(null);

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      reloadUser: loadCurrentUser,
    }),
    [user, isLoading, login, logout, loadCurrentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
