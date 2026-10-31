import { c as stringType, i as literalType, l as unionType, o as numberType, r as enumType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
import { a as visualSourceSchema } from "./visual-EuFN5w1X.mjs";
import { l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-mC0fD6Ng.mjs";
import { t as createServerRpc } from "./createServerRpc-DSPYtqIT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations.functions-C8Qx0ZlF.js
var binaryInfo = objectType({
	format: enumType([
		"ELF",
		"PE",
		"Mach-O",
		"unknown"
	]),
	arch: stringType(),
	bits: numberType().nullable(),
	sizeBytes: numberType(),
	sections: arrayType(objectType({
		name: stringType(),
		size: numberType(),
		offset: numberType()
	})),
	imports: arrayType(stringType()),
	strings: arrayType(stringType())
});
var createInput = objectType({
	question: stringType().min(5).max(500),
	source: unionType([
		objectType({
			type: literalType("github"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("upload"),
			name: stringType(),
			files: arrayType(objectType({
				path: stringType(),
				content: stringType()
			})).max(1500)
		}),
		objectType({
			type: literalType("web"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("runtime"),
			url: stringType().url()
		}),
		objectType({
			type: literalType("binary"),
			name: stringType(),
			info: binaryInfo
		}),
		visualSourceSchema
	]),
	maxSteps: numberType().int().min(3).max(20).default(10)
});
var createInvestigation_createServerFn_handler = createServerRpc({
	id: "3a53225380182d86c91560fa56f6c448662987000c285e1c760c8b0d2f04f472",
	name: "createInvestigation",
	filename: "src/lib/recon/investigations.functions.ts"
}, (opts) => createInvestigation.__executeServer(opts));
var createInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createInput.parse(d)).handler(createInvestigation_createServerFn_handler, async ({ data, context }) => {
	const sb = context.supabase;
	let payload;
	let ref;
	let targetType;
	let fileCount = 0;
	if (data.source.type === "github" || data.source.type === "upload") {
		const { extractZip, parseGithubUrl } = await import("./repo-loader-Dz-5o2Ka.mjs");
		let files;
		if (data.source.type === "github") {
			const gh = parseGithubUrl(data.source.url);
			if (!gh) throw new Error("That doesn't look like a GitHub repository link.");
			const { loadToken } = await import("./token.server-DV5vCgX1.mjs");
			const token = await loadToken(context.userId);
			const headers = {
				"User-Agent": "recon-investigator",
				Accept: "application/vnd.github+json"
			};
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}/zipball${gh.ref ? `/${gh.ref}` : ""}`, { headers });
			if (!res.ok) throw new Error(res.status === 404 ? "Repository not found. If it is private, save a GitHub token in Settings." : `GitHub download failed (${res.status}).`);
			files = extractZip(new Uint8Array(await res.arrayBuffer()));
			ref = `github.com/${gh.owner}/${gh.repo}${gh.ref ? `@${gh.ref}` : ""}`;
		} else {
			files = data.source.files;
			ref = data.source.name;
		}
		if (!files.length) throw new Error("No supported source files were found.");
		payload = {
			type: "repo",
			files
		};
		targetType = "repo";
		fileCount = files.length;
	} else if (data.source.type === "web") {
		const { crawlSite, isPublicHttpUrl } = await import("./web-Cd3d0zEp.mjs").then((n) => n.i).then((n) => n.r);
		if (!isPublicHttpUrl(data.source.url)) throw new Error("Only public http/https URLs are allowed.");
		const site = await crawlSite(data.source.url);
		if (!site.pages.length) throw new Error("Could not fetch that site — no pages responded.");
		payload = {
			type: "web",
			site
		};
		ref = site.origin;
		targetType = "web";
		fileCount = site.pages.length;
	} else if (data.source.type === "runtime") {
		const { fingerprint, isPublicHttpUrl } = await import("./runtime-BgOxKNyC.mjs").then((n) => n.r);
		if (!isPublicHttpUrl(data.source.url)) throw new Error("Only public http/https URLs are allowed.");
		const target = await fingerprint(data.source.url);
		if (!target.probes.some((p) => p.ok)) throw new Error("The target did not respond to any probe.");
		payload = {
			type: "runtime",
			target
		};
		ref = target.baseUrl;
		targetType = "runtime";
		fileCount = target.probes.length;
	} else if (data.source.type === "visual") {
		payload = data.source;
		ref = data.source.name;
		targetType = "visual";
		fileCount = data.source.frames.length;
	} else {
		payload = {
			type: "binary",
			info: data.source.info,
			name: data.source.name
		};
		ref = data.source.name;
		targetType = "binary";
		fileCount = data.source.info.strings.length;
	}
	const { data: id, error } = await sb.rpc("recon_create", {
		p_question: data.question,
		p_title: data.question.slice(0, 80),
		p_target_ref: ref,
		p_target_type: targetType,
		p_max_steps: data.maxSteps,
		p_payload: payload
	});
	if (error || !id) throw new Error("Could not save the investigation and source data.");
	return {
		id,
		fileCount
	};
});
var advanceInvestigation_createServerFn_handler = createServerRpc({
	id: "a6b089f511fe4215441fc2e7eac53f639034e54471540d2c68b58689d54b16d9",
	name: "advanceInvestigation",
	filename: "src/lib/recon/investigations.functions.ts"
}, (opts) => advanceInvestigation.__executeServer(opts));
var advanceInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(advanceInvestigation_createServerFn_handler, async ({ data, context }) => {
	const { advance } = await import("./agent.server-D1HwE5oP.mjs");
	const { decodePayload } = await import("./payload-5vQGPBXj.mjs");
	const sb = context.supabase;
	const { data: inv, error } = await sb.from("investigations").select("*").eq("id", data.id).single();
	if (error || !inv) throw new Error("Investigation not found");
	if (!["queued", "running"].includes(inv.status)) return { status: inv.status };
	const lease = crypto.randomUUID();
	const { data: claimed, error: claimError } = await sb.rpc("recon_claim", {
		p_id: data.id,
		p_lease: lease
	});
	if (claimError) throw new Error("Could not claim the next investigation step.");
	if (!claimed?.length) return {
		status: inv.status,
		waiting: true
	};
	const checkpoint = claimed[0];
	if (!checkpoint) return {
		status: inv.status,
		waiting: true
	};
	const { data: idx } = await sb.from("repo_indexes").select("files").eq("investigation_id", data.id).single();
	const payload = decodePayload(idx?.files);
	let renewing = false;
	const heartbeat = setInterval(async () => {
		if (renewing) return;
		renewing = true;
		try {
			await sb.from("investigations").update({ lease_until: new Date(Date.now() + 18e4).toISOString() }).eq("id", data.id).eq("lease_id", lease);
		} finally {
			renewing = false;
		}
	}, 3e4);
	const beforeWork = async () => {
		const { data: current, error: checkError } = await sb.from("investigations").select("status,lease_id,revision").eq("id", data.id).single();
		if (checkError || !current || current.lease_id !== lease || current.revision !== checkpoint.revision || !["queued", "running"].includes(current.status)) throw new Error("Investigation paused or changed.");
	};
	const state = {
		question: checkpoint.question,
		status: checkpoint.status,
		step_count: checkpoint.step_count,
		max_steps: checkpoint.max_steps,
		steps: checkpoint.steps,
		evidence: checkpoint.evidence,
		hypotheses: checkpoint.hypotheses,
		plan: checkpoint.plan
	};
	try {
		await beforeWork();
		const out = await advance(state, payload, beforeWork);
		const { data: saved, error: saveError } = await sb.from("investigations").update({
			lease_id: null,
			lease_until: null,
			revision: checkpoint.revision + 1,
			status: out.state.status,
			step_count: out.state.step_count,
			steps: out.state.steps,
			evidence: out.state.evidence,
			hypotheses: out.state.hypotheses,
			plan: out.state.plan,
			...out.report ? {
				report: out.report,
				confidence: out.confidence
			} : {}
		}).eq("id", data.id).eq("lease_id", lease).eq("revision", checkpoint.revision).select("status").maybeSingle();
		if (saveError) throw new Error("Could not save this investigation step. Retry from the last saved checkpoint.");
		return { status: saved?.status ?? "paused" };
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Investigation step failed";
		console.error("advance failed");
		state.steps.push({
			i: state.steps.length + 1,
			type: "error",
			title: "Investigation stopped",
			detail: msg,
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
		const { data: failed, error: failureError } = await sb.from("investigations").update({
			status: "failed",
			error: msg,
			lease_id: null,
			lease_until: null,
			revision: checkpoint.revision + 1
		}).eq("id", data.id).eq("lease_id", lease).eq("revision", checkpoint.revision).select("id").maybeSingle();
		if (failureError) throw new Error("Could not save the failure state. Refresh after a few minutes to retry.");
		if (!failed) return { status: "paused" };
		return {
			status: "failed",
			error: msg
		};
	} finally {
		clearInterval(heartbeat);
		await sb.from("investigations").update({
			lease_id: null,
			lease_until: null
		}).eq("id", data.id).eq("lease_id", lease);
	}
});
var saveGithubToken_createServerFn_handler = createServerRpc({
	id: "d750d6bd3b711ee53ea063781ef85bde32ebece97440a67a0c9f4e0d83522211",
	name: "saveGithubToken",
	filename: "src/lib/recon/investigations.functions.ts"
}, (opts) => saveGithubToken.__executeServer(opts));
var saveGithubToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ token: stringType().min(10).max(200) }).parse(d)).handler(saveGithubToken_createServerFn_handler, async ({ data, context }) => {
	if (!(await fetch("https://api.github.com/user", { headers: {
		Authorization: `Bearer ${data.token.trim()}`,
		Accept: "application/vnd.github+json",
		"User-Agent": "recon-investigator"
	} })).ok) throw new Error("GitHub did not accept this token. Check its validity and selected repository permissions.");
	const { encryptToken } = await import("./token.server-DV5vCgX1.mjs");
	const { supabaseAdmin } = await import("./client.server-Vk42uBn7.mjs");
	const { error } = await supabaseAdmin.from("user_secrets").upsert({
		user_id: context.userId,
		key: "github_token",
		value: await encryptToken(data.token.trim()),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id,key" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var removeGithubToken_createServerFn_handler = createServerRpc({
	id: "229a1906aedf1fd9713be878e5557dc72e7942734ee01a2d1b3d36866c610ab9",
	name: "removeGithubToken",
	filename: "src/lib/recon/investigations.functions.ts"
}, (opts) => removeGithubToken.__executeServer(opts));
var removeGithubToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(removeGithubToken_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-Vk42uBn7.mjs");
	const { error } = await supabaseAdmin.from("user_secrets").delete().eq("user_id", context.userId).eq("key", "github_token");
	if (error) throw new Error(error.message);
	return { ok: true };
});
var hasGithubToken_createServerFn_handler = createServerRpc({
	id: "046a1712478fea619dbd2838109b20488d579bb2ee0700790b604ec0c4626daf",
	name: "hasGithubToken",
	filename: "src/lib/recon/investigations.functions.ts"
}, (opts) => hasGithubToken.__executeServer(opts));
var hasGithubToken = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(hasGithubToken_createServerFn_handler, async ({ context }) => {
	const { loadToken } = await import("./token.server-DV5vCgX1.mjs");
	const token = await loadToken(context.userId);
	return { saved: Boolean(token) };
});
//#endregion
export { advanceInvestigation_createServerFn_handler, createInvestigation_createServerFn_handler, hasGithubToken_createServerFn_handler, removeGithubToken_createServerFn_handler, saveGithubToken_createServerFn_handler };
