import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const { error } = await login(email, password);

    if (error) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    navigate("/");
  }
  
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
            <Hammer size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Valverde Manager</h1>

            <p className="text-sm text-zinc-400">Carpintería & Herrería</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 py-3 font-medium text-white transition hover:bg-orange-500"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
