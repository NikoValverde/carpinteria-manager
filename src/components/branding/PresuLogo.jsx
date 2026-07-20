import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import presuLogoAnimation from "../../assets/branding/presu-logo.json";

/**
 * PresuLogo
 *
 * Componente reutilizable de branding que renderiza la animación
 * del logo de la aplicación mediante lottie-react.
 *
 * No contiene estilos ni lógica específica de ninguna pantalla,
 * por lo que puede utilizarse en cualquier parte de la app
 * (Login, Navbar, splash screens, etc.).
 */
function PresuLogo({
  size = 180,
  loop = true,
  autoplay = true,
  speed = 1,
  className = "",
  onComplete, // Nueva prop
}) {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <Lottie.default
      lottieRef={lottieRef}
      animationData={presuLogoAnimation}
      loop={loop}
      autoplay={autoplay}
      onComplete={onComplete} // Pasamos el callback
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

export default PresuLogo;
