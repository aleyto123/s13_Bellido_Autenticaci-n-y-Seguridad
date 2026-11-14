"use client";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
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
  const inputClass = "auth-input";
  return <AuthShell register><section className="auth-form-content">
      <h1 className="auth-title">Tu cuenta, tu espacio<span className="title-dot">.</span></h1>
      <p className="auth-subtitle">Solo unos datos para empezar algo nuevo.</p>
      {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={register} className="space-y-4">
        <label className="block text-sm font-medium">Nombre<input name="name" placeholder="¿Cómo te llamas?" autoComplete="name" required minLength={2} maxLength={80} className={inputClass} /></label>
        <label className="block text-sm font-medium">Correo electrónico<input name="email" placeholder="tu@correo.com" type="email" autoComplete="email" required maxLength={254} className={inputClass} /></label>
        <label className="block text-sm font-medium">Contraseña<input name="password" placeholder="Escribe tu contraseña" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={inputClass} /></label>
        <p className="text-xs text-gray-500">Usa al menos 8 caracteres. Máximo 72 bytes.</p>
        <label className="block text-sm font-medium">Confirmar contraseña<input name="confirmation" placeholder="Escribe tu contraseña" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={inputClass} /></label>
        <button disabled={pending} className="primary-button">{pending ? "Creando cuenta…" : "Registrarme"}</button>
      </form>
      <p className="auth-switch">¿Ya tienes cuenta? <Link href="/signIn" className="font-semibold text-black underline underline-offset-4">Inicia sesión</Link></p>
    </section></AuthShell>;
}
