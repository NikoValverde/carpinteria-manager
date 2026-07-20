import { motion } from "framer-motion";
import PresuLogo from "./PresuLogo";

/**
 * PresuLoader
 *
 * Loader reutilizable de branding para toda la aplicación. Centra el
 * isotipo animado (PresuLogo) junto con un texto debajo, ambos alineados
 * vertical y horizontalmente.
 *
 * No depende de ninguna pantalla ni servicio: solo deja preparada la
 * infraestructura visual para futuros loaders (carga inicial, guards de
 * rutas, estados de espera dentro de módulos, etc.).
 */
function PresuLoader({ text = "Cargando...", className = "", size = 90 }) {
  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-4 ${className}`}
    >
      <PresuLogo size={size} loop autoplay />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-sm text-zinc-400"
      >
        {text}
      </motion.p>
    </div>
  );
}

export default PresuLoader;
