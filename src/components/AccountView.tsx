import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiGrid, FiLock, FiMail, FiShield, FiUser } from "react-icons/fi";
import styles from "./AccountView.module.css";

type User = { name?: string | null; email?: string | null; image?: string | null };

export default function AccountView({ user, profile = false }: { user: User; profile?: boolean }) {
  const name = user.name || "Tu cuenta";
  const initials = name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  const avatar = <span className={styles.avatar}>{user.image ? <Image src={user.image} alt={`Foto de ${name}`} width={96} height={96} /> : initials}</span>;

  return <div className={styles.workspace}>
    <div className={styles.breadcrumb}>MI CUENTA <span>/</span> {profile ? "MI PERFIL" : "MI ESPACIO"}</div>
    <header className={styles.heading}><div><h1>{profile ? "Mi perfil" : "Tu espacio personal"}<span>.</span></h1><p>{profile ? "Los detalles que hacen que esta cuenta sea tuya." : "Todo lo que necesitas, en un solo lugar."}</p></div><span className={styles.status}><span /> Sesión activa</span></header>
    <nav className={styles.tabs} aria-label="Secciones de mi cuenta"><Link href="/dashboard" aria-current={!profile ? "page" : undefined}><FiGrid /> Mi espacio</Link><Link href="/profile" aria-current={profile ? "page" : undefined}><FiUser /> Mi perfil</Link></nav>
    {profile ? <div className={styles.profileGrid}>
      <aside className={styles.identity}><div className={styles.cover}><FiLayersDecoration /></div><div className={styles.identityBody}>{avatar}<h2>{name}</h2><p>{user.email || "Sin correo disponible"}</p><span className={styles.identityBadge}><FiCheck /> Sesión iniciada</span><div className={styles.identityNote}><FiShield /><p>Tu espacio, protegido.<br /><span>Tus datos forman parte de tu cuenta personal.</span></p></div></div></aside>
      <section className={styles.panel}><div className={styles.sectionHeading}><span className={styles.icon}><FiUser /></span><div><h2>Información personal</h2><p>Datos de tu cuenta actual.</p></div></div><dl className={styles.details}><div><dt><FiUser /> Nombre completo</dt><dd>{name}</dd></div><div><dt><FiMail /> Correo electrónico</dt><dd>{user.email || "Sin correo disponible"}</dd></div><div><dt><FiLock /> Estado de la sesión</dt><dd><span className={styles.inlineStatus}>Activa</span></dd></div></dl><div className={styles.panelNote}><FiLock /><p>Esta información corresponde a la cuenta con la que iniciaste sesión.</p></div><Link className={styles.back} href="/dashboard"><FiArrowLeft /> Volver a mi espacio</Link></section>
    </div> : <>
      <section className={styles.welcome}><div className={styles.welcomeCopy}><span className={styles.welcomeEyebrow}>QUÉ BUENO TENERTE AQUÍ</span><h2>Hola, {name.split(" ")[0]}<span> ✦</span></h2><p>Este es tu lugar. Consulta tu información y continúa con la tranquilidad de tener tu cuenta a mano.</p><Link href="/profile">Explorar mi perfil <FiArrowUpRight /></Link></div><div className={styles.welcomeArt} aria-hidden="true"><span className={styles.ring} /><span className={styles.ringTwo} /><div className={styles.shield}><FiShield /><span><FiCheck /></span></div><span className={styles.artLabel}><span /> TU ESPACIO, PROTEGIDO</span></div></section>
      <div className={styles.dashboardGrid}><section className={styles.panel}><div className={styles.sectionHeading}><span className={styles.icon}><FiUser /></span><div><h2>Tu cuenta</h2><p>Un vistazo a tu información.</p></div><Link href="/profile" className={styles.iconLink} aria-label="Ver mi perfil"><FiArrowUpRight /></Link></div><div className={styles.accountSummary}>{avatar}<div><h3>{name}</h3><p>{user.email || "Sin correo disponible"}</p><span>Cuenta personal</span></div></div><Link className={styles.rowLink} href="/profile">Ver información de mi perfil <FiArrowUpRight /></Link></section><section className={`${styles.panel} ${styles.security}`}><span className={styles.icon}><FiShield /></span><h2>Una sesión, tu espacio.</h2><p>Has iniciado sesión correctamente. Cuando termines de usar un equipo compartido, recuerda cerrar tu sesión.</p><div className={styles.securityFoot}><FiLock /> Tú tienes el control</div></section></div>
    </>}
    <footer className={styles.footer}><span>MyAuthApp <span>·</span> Hecho para conectar con confianza.</span><span><FiShield /> Tu espacio personal</span></footer>
  </div>;
}

function FiLayersDecoration() { return <div className={styles.coverDecoration} aria-hidden="true"><FiShield /><span>MI ESPACIO / MI IDENTIDAD</span></div>; }
