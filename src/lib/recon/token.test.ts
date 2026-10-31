import { it, expect, vi, afterEach } from "vitest";
import { encryptToken, decryptToken } from "./token.server";
afterEach(() => vi.unstubAllEnvs());
it("stored tokens are encrypted and authenticated", async () => {
  vi.stubEnv("RECON_TOKEN_ENCRYPTION_SECRET", "test-only-not-a-real-key");
  const encrypted = await encryptToken("fixture-not-a-real-token");
  expect(encrypted).not.toContain("fixture-not-a-real-token");
  expect(await decryptToken(encrypted)).toBe("fixture-not-a-real-token");
  vi.stubEnv("RECON_TOKEN_ENCRYPTION_SECRET", "different-test-only-key");
  await expect(decryptToken(encrypted)).rejects.toThrow();
});
it("encryption fails closed without configuration", async () => {
  vi.stubEnv("RECON_TOKEN_ENCRYPTION_SECRET", "");
  await expect(encryptToken("fixture")).rejects.toThrow("not configured");
});
