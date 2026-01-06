import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuthContext } from "./AuthContext";

const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const { user, loading: authLoading } = useAuthContext();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (authLoading) return;

      // Si no hay user, reseteamos
      if (!user) {
        if (!mounted) return;
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error loading profile:", error);
          // Si no existe aún, lo dejamos null (pero no loading infinito)
          if (!mounted) return;
          setProfile(null);
        } else {
          if (!mounted) return;
          setProfile(data);
        }
      } catch (err) {
        console.error("loadProfile threw:", err);
        if (!mounted) return;
        setProfile(null);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  const role = profile?.role || null;
  const isProvider = role === "provider";
  const isClient = role === "client";

  const value = useMemo(
    () => ({
      profile,
      role,
      isProvider,
      isClient,
      profileLoading,
      reloadProfile: async () => {
        if (!user) return;
        setProfileLoading(true);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data ?? null);
        setProfileLoading(false);
      },
    }),
    [profile, role, isProvider, isClient, profileLoading, user]
  );

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviderContext() {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error("useProviderContext debe usarse dentro de <ProviderProvider>");
  return ctx;
}
