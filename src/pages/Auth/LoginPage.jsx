import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import PresuLogo from "../../components/branding/PresuLogo";

// Curva de easing tipo "expo-out" suave
const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const LOGOTYPE_NAME = "Presu";

const letterVariant = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: PREMIUM_EASE },
  },
};

function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Cuando el logo termine su animación, mostramos el contenido
  const handleLogoComplete = () => {
    setShowContent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="mb-10 flex flex-col items-center">
          {/* Contenedor que alterna entre estado inicial (logo solo, centrado)
              y estado final (icono + palabra en fila). El prop `layout` hace
              que framer-motion anime el reflow automáticamente, sin
              transforms manuales ni posicionamiento absoluto: así se evita
              el solapamiento entre el icono y el texto. */}
          <motion.div
            layout
            transition={{ duration: 1, ease: PREMIUM_EASE }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div layout transition={{ duration: 1, ease: PREMIUM_EASE }}>
              <PresuLogo
                size={showContent ? 90 : 200}
                speed={1.2}
                loop={false}
                autoplay
                onComplete={handleLogoComplete}
                className="shrink-0"
              />
            </motion.div>

            {/* Texto "Presu" que aparece después de la animación */}
            <AnimatePresence>
              {showContent && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: PREMIUM_EASE }}
                  className="flex text-5xl font-semibold tracking-tight text-white"
                >
                  {LOGOTYPE_NAME.split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariant}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        duration: 0.5,
                        ease: PREMIUM_EASE,
                        delay: 0.3 + index * 0.09,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Eslogan: fade-in + leve desplazamiento vertical, un poco más chico */}
          <AnimatePresence>
            {showContent && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1, ease: PREMIUM_EASE }}
                className="mt-3 text-center text-sm text-zinc-400"
              >
                Presupuestos profesionales, sin complicaciones.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Formulario que aparece después */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: PREMIUM_EASE }}
                className="w-full mt-6"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-left text-sm text-zinc-400">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-left text-sm text-zinc-400">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 pr-11 text-white outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 transition hover:text-zinc-300"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
