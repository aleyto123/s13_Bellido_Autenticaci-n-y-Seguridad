import { createClient, type Client } from "@libsql/client";

let client: Client | undefined;
let initialization: Promise<void> | undefined;

export async function database() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (process.env.VERCEL && (!url || url.startsWith("file:"))) {
      throw new Error("DATABASE_NOT_CONFIGURED");
    }
    client = createClient({
      url: url || "file:./users.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  initialization ??= client.execute(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`).then(() => {}).catch((error) => {
    initialization = undefined;
    throw error;
  });
  await initialization;
  return client;
}
