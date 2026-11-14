"use client";
import { signIn } from "next-auth/react";
import { useState, useSyncExternalStore } from "react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleGoogleSignIn() {
    setPending(true);
    setError("");
    try {
      // Google OAuth necesita redirigir al proveedor para completar el acceso.
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("No se pudo iniciar sesión. Revisa la configuración de Google e inténtalo otra vez.");
      setPending(false);
    }
  }
  const oauthError = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).has("error"),
    () => false,
  );
  return <div className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-gray-100 p-6">
    <div className="w-96 rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign In</h1>
      {(error || oauthError) && <p role="alert" className="mb-4 text-sm text-red-700">{error || "No se pudo completar el acceso con Google. Verifica tus credenciales y el usuario de prueba."}</p>}
      <button disabled={pending} onClick={handleGoogleSignIn} className="flex w-full items-center justify-center gap-2 rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-black">
        <FaGoogle aria-hidden="true" />{pending ? "Conectando…" : "Continue with Google"}
      </button>
    </div>
  </div>;
}
