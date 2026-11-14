import { FiArrowUpRight, FiCheck, FiLock, FiShield } from "react-icons/fi";

export default function AuthShell({ children, register = false }: { children: React.ReactNode; register?: boolean }) {
  return <div className="auth-stage"><div className="auth-shell">
    <aside className="auth-story">
      <div className="story-top"><span className="story-pill"><span /> TU ESPACIO, PROTEGIDO</span><FiArrowUpRight /></div>
      <div className="story-copy"><p className="eyebrow">SIMPLE. SEGURO. TUYO.</p><h2>Tu próximo paso<br />empieza <em>aquí.</em></h2><p>Un solo lugar para conectar.<br />Entra a tu cuenta y continúa donde lo dejaste.</p></div>
      <div className="security-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✦</span><div className="shield-tile"><FiShield /><span className="shield-check"><FiCheck /></span></div><div className="floating-label"><span><FiLock /></span><div>Acceso protegido<small>Tu tranquilidad va primero</small></div><FiCheck /></div></div>
      <div className="story-bottom"><span><FiShield /> Privacidad en cada conexión</span><span>01 / 03</span></div>
    </aside>
    <div className="auth-form-panel"><div className="form-topline"><span>{register ? "COMIENZA AQUÍ" : "QUÉ BUENO VERTE DE NUEVO"}</span><FiLock /></div>{children}<div className="form-footnote"><FiShield /> Una conexión segura, de principio a fin.</div></div>
  </div><footer className="auth-footer"><span>© {new Date().getFullYear()} MyAuthApp</span><span>Hecho para conectar con confianza.</span></footer></div>;
}
