import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");
  return <div className="workspace"><div>
    <div className="workspace-card">
      <p className="workspace-eyebrow">MYAUTHAPP / TU ESPACIO PERSONAL</p><h1>Dashboard</h1>
      <p className="mb-2 text-gray-700">Bienvenido, <span className="font-semibold">{session.user.name}</span></p>
      <p>Tu cuenta está lista. Desde aquí puedes consultar tus datos y gestionar tu sesión.</p>
      <div className="workspace-links"><Link href="/profile">Ver mi perfil ↗</Link><Link href="/dashboard">Mi espacio</Link></div>
    </div>
  </div></div>;
}
