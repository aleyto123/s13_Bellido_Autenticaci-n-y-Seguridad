import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AccountView from "@/components/AccountView";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");
  return <AccountView user={session.user} />;
}