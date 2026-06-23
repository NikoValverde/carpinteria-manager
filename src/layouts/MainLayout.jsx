import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Users, Package, HardHat, FileText, Hammer, Menu, X } from "lucide-react";
import { ChevronDown, LogOut, Shield, UserCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { perfil, logout } = useAuth();

function getInitials(nombre) {
  if (!nombre) return "";
  const partes = nombre.trim().split(" ");
  if (partes.length === 1) {
    // Si solo hay un nombre → primeras dos letras
    return partes[0].slice(0, 2).toUpperCase();
  } else {
    // Si hay más de una palabra → primera letra de las dos primeras
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
}


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600">
              <Hammer size={20} />
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-2xl font-bold leading-none text-white">
                VALVERDE
              </div>
              <p className="text-xs text-zinc-500 mt-2.5">
                Carpintería & Herrería
              </p>
            </div>
          </div>

          {/* Menú */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 min-w-[140px] rounded-lg px-4 py-2 transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Users size={16} />
              Clientes
            </NavLink>

            <NavLink
              to="/materiales"
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 min-w-[140px] rounded-lg px-4 py-2 transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Package size={16} />
              Materiales
            </NavLink>

            <NavLink
              to="/integrantes"
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 min-w-[140px] rounded-lg px-4 py-2 transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <HardHat size={16} />
              Integrantes
            </NavLink>

            <NavLink
              to="/presupuestos"
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 min-w-[140px] rounded-lg px-4 py-2 transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <FileText size={16} />
              Presupuestos
            </NavLink>
          </nav>

          {/* Usuario */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl border border-transparent bg-transparent px-2 py-1.5 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white">
                  {getInitials(perfil?.nombre) || "NV"}
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-100">
                    {perfil?.nombre || "Usuario"}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Shield size={12} />
                    {perfil?.rol || "usuario"}
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <div className="border-b border-zinc-800 p-4">
                    <p className="text-sm font-medium text-white">
                      {perfil?.nombre}
                    </p>

                    <p className="text-xs text-zinc-500">{perfil?.rol}</p>
                  </div>

                  <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800">
                    <UserCircle size={16} />
                    Mi perfil
                  </button>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-red-950/30"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Botón hamburguesa */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menú mobile desplegable */}
        {mobileMenuOpen && (
          <nav className="border-t border-zinc-800 bg-zinc-950 px-6 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <Users size={16} />
                Clientes
              </NavLink>

              <NavLink
                to="/materiales"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <Package size={16} />
                Materiales
              </NavLink>

              <NavLink
                to="/integrantes"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <HardHat size={16} />
                Integrantes
              </NavLink>

              <NavLink
                to="/presupuestos"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <FileText size={16} />
                Presupuestos
              </NavLink>

              <div className="mt-4 border-t border-zinc-800 pt-4">
                <div className="mb-3 flex items-center gap-3 px-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white">
                    {getInitials(perfil?.nombre) || "NV"}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {perfil?.nombre}
                    </p>

                    <p className="text-xs text-zinc-500">{perfil?.rol}</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-red-400 transition hover:bg-red-950/30"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-[1700px] px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
