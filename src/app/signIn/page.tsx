"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const query = useSyncExternalStore(() => () => {}, () => window.location.search, () => "");
  const params = new URLSearchParams(query);
  const [dismissed, setDismissed] = useState(false);
  const oauthError = !dismissed && params.has("error");

  async function handleCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setDismissed(true); setPending("credentials");
    const data = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: data.get("email"), password: data.get("password"), redirect: false,
      });
      if (result?.ok && !result.error) {
        router.push("/dashboard"); router.refresh(); return;
      }
      setError(result?.error === "AccountLocked"
        ? "Cuenta bloqueada por 15 minutos tras 5 intentos fallidos. Inténtalo después de ese plazo."
        : result?.error === "ServiceUnavailable"
          ? "El servicio no está disponible. Inténtalo más tarde."
          : "Correo o contraseña incorrectos.");
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setPending(""); }
  }

  async function handleOAuth(provider: "google" | "github") {
    setError(""); setDismissed(true); setPending(provider);
    try { await signIn(provider, { callbackUrl: "/dashboard" }); }
    catch { setError("No se pudo iniciar sesión. Inténtalo otra vez."); setPending(""); }
  }

  const inputClass = "mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700";
  return <div className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-gray-100 px-6 py-10">
    <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="text-center text-2xl font-bold text-gray-800">Iniciar sesión</h1>
      <p className="mt-2 mb-6 text-center text-sm text-gray-500">Accede con tu cuenta o un proveedor externo.</p>
      {params.has("registered") && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">Cuenta creada. Ya puedes iniciar sesión.</p>}
      {(error || oauthError) && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error || "No se pudo completar el acceso con el proveedor seleccionado."}</p>}
      <form onSubmit={handleCredentials} className="space-y-4">
        <label className="block text-sm font-medium">Correo electrónico
          <input name="email" type="email" autoComplete="username" required maxLength={254} className={inputClass} />
        </label>
        <label className="block text-sm font-medium">Contraseña
          <input name="password" type="password" autoComplete="current-password" required maxLength={1024} className={inputClass} />
        </label>
        <button disabled={!!pending} className="w-full rounded bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800">{pending === "credentials" ? "Ingresando…" : "Ingresar"}</button>
      </form>
      <p className="mt-3 text-center text-xs text-gray-500">5 intentos fallidos bloquean la cuenta durante 15 minutos.</p>
      <div className="my-6 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200" />O CONTINÚA CON<span className="h-px flex-1 bg-gray-200" /></div>
      <div className="grid grid-cols-2 gap-3">
        <button disabled={!!pending} onClick={() => handleOAuth("google")} className="flex items-center justify-center gap-2 rounded border border-gray-300 px-4 py-2.5 text-sm hover:bg-gray-100"><FaGoogle aria-hidden="true" />{pending === "google" ? "Conectando…" : "Google"}</button>
        <button disabled={!!pending} onClick={() => handleOAuth("github")} className="flex items-center justify-center gap-2 rounded bg-gray-800 px-4 py-2.5 text-sm text-white hover:bg-black"><FaGithub aria-hidden="true" />{pending === "github" ? "Conectando…" : "GitHub"}</button>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">¿No tienes cuenta? <Link href="/register" className="font-semibold text-black underline underline-offset-4">Regístrate</Link></p>
    </section>
  </div>;
}
