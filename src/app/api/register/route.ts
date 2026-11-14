import { NextResponse } from "next/server";
import { AccountError, registerAccount } from "@/lib/accounts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = new URL(process.env.NEXTAUTH_URL || request.url).origin;
  if (!origin || origin !== allowedOrigin) {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Formato de solicitud no válido." }, { status: 415 });
  }
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 4096) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
    let input;
    try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: "Datos no válidos." }, { status: 400 }); }
    if (!input || typeof input.name !== "string" || typeof input.email !== "string" || typeof input.password !== "string") {
      return NextResponse.json({ error: "Completa todos los campos." }, { status: 400 });
    }
    await registerAccount(input);
    return NextResponse.json({ message: "Cuenta creada correctamente." }, { status: 201 });
  } catch (error) {
    if (error instanceof AccountError) {
      const duplicate = error.message === "EmailExists";
      return NextResponse.json({ error: duplicate ? "Ya existe una cuenta con este correo." : "Revisa el nombre, el correo y la contraseña (mínimo 8 caracteres y máximo 72 bytes)." }, { status: duplicate ? 409 : 400 });
    }
    console.error("No se pudo completar el registro.");
    return NextResponse.json({ error: "No se pudo crear la cuenta. Inténtalo más tarde." }, { status: 503 });
  }
}
