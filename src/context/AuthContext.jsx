import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  loginUser,
  registerUser,
  logoutUser,
  loginWithGoogle,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Si esto falla o queda colgado, igual queremos salir del loading.
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("supabase.auth.getSession error:", error);
        }

        if (!mounted) return;

        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("getSession threw:", err);
        if (!mounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // Listener de cambios de sesión
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setLoading(false); // 🔥 por si entra antes que getSession o si getSession falla
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }) => {
    return await loginUser(email, password);
  };

  const loginGoogle = async () => {
    return await loginWithGoogle();
  };

  const register = async ({ email, password }) => {
    return await registerUser(email, password);
  };

  const logout = async () => {
    return await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        loginGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
