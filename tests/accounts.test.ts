import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import bcrypt from "bcrypt";

test("registro, hash bcrypt, duplicados, bloqueo persistente y desbloqueo", async () => {
  const folder = await mkdtemp(join(tmpdir(), "lab13-"));
  process.env.TURSO_DATABASE_URL = `file:${join(folder, "test.db").replaceAll("\\", "/")}`;
  const { registerAccount, authenticateAccount, LOCK_DURATION_MS } = await import("../src/lib/accounts");
  const { database } = await import("../src/lib/database");
  const password = "Laboratorio2026!";
  try {
    await assert.rejects(registerAccount({ name: "A", email: "bad", password: "123" }), /InvalidInput/);
    const account = await registerAccount({ name: "Estudiante", email: " TEST@example.com ", password });
    assert.equal(account.email, "test@example.com");
    const db = await database();
    const stored = (await db.execute("SELECT * FROM users")).rows[0];
    assert.notEqual(stored.password_hash, password);
    assert.match(String(stored.password_hash), /^\$2[aby]\$12\$/);
    assert.ok(await bcrypt.compare(password, String(stored.password_hash)));
    await assert.rejects(registerAccount({ name: "Duplicado", email: account.email, password }), /EmailExists/);
    assert.equal(await authenticateAccount("unknown@example.com", password), null);
    assert.equal(await authenticateAccount(account.email, "bad"), null);
    assert.equal((await authenticateAccount(account.email, password))?.id, account.id);
    assert.equal(Number((await db.execute("SELECT failed_attempts FROM users")).rows[0].failed_attempts), 0);
    const now = Date.now();
    for (let attempt = 0; attempt < 4; attempt++) assert.equal(await authenticateAccount(account.email, "bad", now), null);
    await assert.rejects(authenticateAccount(account.email, "bad", now), /AccountLocked/);
    await assert.rejects(authenticateAccount(account.email, password, now + 1), /AccountLocked/);
    assert.equal(Number((await db.execute("SELECT failed_attempts FROM users")).rows[0].failed_attempts), 5);
    assert.equal((await authenticateAccount(account.email, password, now + LOCK_DURATION_MS + 1))?.id, account.id);
    for (let attempt = 0; attempt < 4; attempt++) await authenticateAccount(account.email, "bad", now);
    await assert.rejects(authenticateAccount(account.email, "bad", now), /AccountLocked/);
    assert.equal(await authenticateAccount(account.email, "bad", now + LOCK_DURATION_MS + 1), null);
    assert.equal(Number((await db.execute("SELECT failed_attempts FROM users")).rows[0].failed_attempts), 1);
    assert.equal((await authenticateAccount(account.email, password, now + LOCK_DURATION_MS + 2))?.id, account.id);
  } finally {
    (await database()).close();
  }
});
