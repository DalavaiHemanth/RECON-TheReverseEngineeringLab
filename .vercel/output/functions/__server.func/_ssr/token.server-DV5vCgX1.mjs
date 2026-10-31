//#region node_modules/.nitro/vite/services/ssr/assets/token.server-DV5vCgX1.js
async function key() {
	const secret = process.env["RECON_TOKEN_ENCRYPTION_SECRET"];
	if (!secret) throw new Error("Secure connection storage is not configured.");
	const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
	return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encryptToken(token) {
	const iv = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
	const ciphertext = new Uint8Array(await crypto.subtle.encrypt({
		name: "AES-GCM",
		iv
	}, await key(), new TextEncoder().encode(token)));
	return "v1:" + btoa(String.fromCharCode(...iv, ...ciphertext));
}
async function decryptToken(value) {
	if (!value.startsWith("v1:")) return value;
	const bytes = Uint8Array.from(atob(value.slice(3)), (c) => c.charCodeAt(0));
	const plaintext = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv: bytes.slice(0, 12)
	}, await key(), bytes.slice(12));
	return new TextDecoder().decode(plaintext);
}
async function loadToken(userId) {
	const { supabaseAdmin } = await import("./client.server-Vk42uBn7.mjs");
	const { data, error } = await supabaseAdmin.from("user_secrets").select("value").eq("user_id", userId).eq("key", "github_token").maybeSingle();
	if (error) throw new Error("Could not read the GitHub connection.");
	if (!data) return null;
	const token = await decryptToken(data.value);
	if (!data.value.startsWith("v1:")) {
		const { error: saveError } = await supabaseAdmin.from("user_secrets").update({ value: await encryptToken(token) }).eq("user_id", userId).eq("key", "github_token");
		if (saveError) throw new Error("Could not upgrade the GitHub connection.");
	}
	return token;
}
//#endregion
export { encryptToken, loadToken };
