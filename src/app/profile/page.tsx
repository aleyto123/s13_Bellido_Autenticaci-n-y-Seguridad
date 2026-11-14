import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");
  return <div className="workspace"><div>
    <div className="workspace-card">
      <p className="workspace-eyebrow">MYAUTHAPP / TU ESPACIO PERSONAL</p><h1>Profile</h1>
      <div className="mb-6 text-gray-700">
        <p className="mb-2">Name: <span className="font-semibold">{session.user.name}</span></p>
        <p className="mb-2">Email: <span className="font-semibold">{session.user.email}</span></p>
        {session.user.image && <><p className="mb-2">Image Profile:</p><Image src={session.user.image} alt="Perfil" width={100} height={100} className="mt-4 h-16 w-16 rounded-full" /></>}
      </div>
    </div>
  </div></div>;
}
