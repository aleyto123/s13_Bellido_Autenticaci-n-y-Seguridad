import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AccountError, authenticateAccount } from "@/lib/accounts";

export const authOptions: NextAuthOptions = {
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }), GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
  }), CredentialsProvider({
    name: "Credenciales",
    credentials: {
      email: { label: "Correo electrónico", type: "email" },
      password: { label: "Contraseña", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      try {
        return await authenticateAccount(credentials.email, credentials.password);
      } catch (error) {
        if (error instanceof AccountError && error.message === "AccountLocked") throw new Error("AccountLocked");
        console.error("No se pudo validar el acceso con credenciales.");
        throw new Error("ServiceUnavailable");
      }
    },
  })],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn", error: "/signIn" },
  secret: process.env.NEXTAUTH_SECRET,
};
