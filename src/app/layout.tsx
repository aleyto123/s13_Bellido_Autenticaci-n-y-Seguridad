import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Provider from "@/components/SessionProvider";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import "./globals.css";

export const metadata: Metadata = { title: "Next Auth App", description: "Laboratorio 13: autenticación con Google" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return <html lang="es"><body>
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="brand"><span className="brand-icon"><FiLayers /></span>MyAuth<span>App</span><span className="brand-dot">.</span></Link>
        <ul className="nav-links">
          {session?.user && <li><Link href="/dashboard">Mi espacio</Link></li>}
          {!session?.user && <><li className="nav-hint">¿Primera vez por aquí?</li><li><Link href="/register" className="nav-register">Crear cuenta <FiArrowUpRight /></Link></li></>}
          {session?.user && <>
            <li><Link href="/profile">Mi perfil</Link></li>
            <li><LogoutButton /></li>
          </>}
          {session?.user?.image && <li><Image src={session.user.image} alt="Perfil" width={40} height={40} className="h-10 w-10 rounded-full" /></li>}
        </ul>
      </div>
    </nav>
    <Provider session={session}><main>{children}</main></Provider>
  </body></html>;
}
