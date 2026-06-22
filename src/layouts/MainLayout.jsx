import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Users, Package, HardHat, FileText, Hammer, Menu, X } from "lucide-react";

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 font-medium">
              NV
            </div>

            <span className="hidden text-sm text-zinc-300 sm:inline">
              Nicolás
            </span>

            {/* Botón hamburguesa (solo mobile) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
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
