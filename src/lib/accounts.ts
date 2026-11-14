import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { database } from "./database";

export const MAX_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000;
export class AccountError extends Error {}

export function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function validPassword(value: string) {
  return value.length >= 8 && Buffer.byteLength(value, "utf8") <= 72;
}

export async function registerAccount(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  if (name.length < 2 || name.length > 80 || !validEmail(email) || !validPassword(input.password)) {
    throw new AccountError("InvalidInput");
  }
  const db = await database();
  const passwordHash = await bcrypt.hash(input.password, 12);
  const id = randomUUID();
  try {
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [id, name, email, passwordHash, Date.now()],
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && String(error.code).includes("SQLITE_CONSTRAINT")) {
      throw new AccountError("EmailExists");
    }
    throw error;
  }
  return { id, name, email };
}

let dummyHash: Promise<string> | undefined;

export async function authenticateAccount(emailInput: string, password: string, now = Date.now()) {
  const email = normalizeEmail(emailInput);
  if (!validEmail(email) || password.length > 1024) return null;
  const db = await database();
  // La transacción de escritura serializa los intentos concurrentes y el desbloqueo.
  const tx = await db.transaction("write");
  try {
    const result = await tx.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
    const user = result.rows[0];
    if (!user) {
      await tx.rollback();
      dummyHash ??= bcrypt.hash("unregistered-account-placeholder", 12);
      await bcrypt.compare(password, await dummyHash);
      return null;
    }
    if (Number(user.locked_until) > now) throw new AccountError("AccountLocked");
    const expired = Number(user.locked_until) > 0;
    const matches = Buffer.byteLength(password, "utf8") <= 72 && await bcrypt.compare(password, String(user.password_hash));
    if (!matches) {
      const attempts = (expired ? 0 : Number(user.failed_attempts)) + 1;
      const locked = attempts >= MAX_ATTEMPTS;
      await tx.execute({
        sql: "UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?",
        args: [attempts, locked ? now + LOCK_DURATION_MS : 0, user.id],
      });
      await tx.commit();
      if (locked) throw new AccountError("AccountLocked");
      return null;
    }
    await tx.execute({ sql: "UPDATE users SET failed_attempts = 0, locked_until = 0 WHERE id = ?", args: [user.id] });
    await tx.commit();
    return { id: String(user.id), name: String(user.name), email: String(user.email) };
  } finally {
    tx.close();
  }
}
