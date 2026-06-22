import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarPerfil(userId) {
    const { data } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", userId)
      .single();

    setPerfil(data);
  }

  useEffect(() => {
    async function obtenerSesion() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const usuario = session?.user ?? null;

      setUser(usuario);

      if (usuario) {
        await cargarPerfil(usuario.id);
      }

      setLoading(false);
    }

    obtenerSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const usuario = session?.user ?? null;

      setUser(usuario);

      if (usuario) {
        await cargarPerfil(usuario.id);
      } else {
        setPerfil(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
