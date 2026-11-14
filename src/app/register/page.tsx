"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmation")) { setError("Las contraseñas no coinciden."); return; }
    setPending(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), password: data.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "No se pudo crear la cuenta."); return; }
      router.push("/signIn?registered=1");
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setPending(false); }
  }
  const inputClass = "mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700";
  return <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-10">
    <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="text-center text-2xl font-bold">Crear cuenta</h1>
      <p className="mt-2 mb-6 text-center text-sm text-gray-500">Registra tus datos para acceder a MyAuthApp.</p>
      {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={register} className="space-y-4">
        <label className="block text-sm font-medium">Nombre<input name="name" autoComplete="name" required minLength={2} maxLength={80} className={inputClass} /></label>
        <label className="block text-sm font-medium">Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={254} className={inputClass} /></label>
        <label className="block text-sm font-medium">Contraseña<input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={inputClass} /></label>
        <p className="text-xs text-gray-500">Usa al menos 8 caracteres. Máximo 72 bytes.</p>
        <label className="block text-sm font-medium">Confirmar contraseña<input name="confirmation" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={inputClass} /></label>
        <button disabled={pending} className="w-full rounded bg-black px-4 py-2.5 font-medium text-white hover:bg-gray-800">{pending ? "Creando cuenta…" : "Registrarme"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">¿Ya tienes cuenta? <Link href="/signIn" className="font-semibold text-black underline underline-offset-4">Inicia sesión</Link></p>
    </section>
  </div>;
}
