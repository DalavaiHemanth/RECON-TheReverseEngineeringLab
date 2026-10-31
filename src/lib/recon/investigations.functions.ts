import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import { visualSourceSchema } from "./visual";

const binaryInfo = z.object({
  format: z.enum(["ELF", "PE", "Mach-O", "unknown"]),
  arch: z.string(),
  bits: z.number().nullable(),
  sizeBytes: z.number(),
  sections: z.array(z.object({ name: z.string(), size: z.number(), offset: z.number() })),
  imports: z.array(z.string()),
  strings: z.array(z.string()),
});

const createInput = z.object({
  question: z.string().min(5).max(500),
  source: z.union([
    z.object({ type: z.literal("github"), url: z.string().url() }),
    z.object({
      type: z.literal("upload"),
      name: z.string(),
      files: z.array(z.object({ path: z.string(), content: z.string() })).max(1500),
    }),
    z.object({ type: z.literal("web"), url: z.string().url() }),
    z.object({ type: z.literal("runtime"), url: z.string().url() }),
    z.object({ type: z.literal("binary"), name: z.string(), info: binaryInfo }),
    visualSourceSchema,
  ]),
  maxSteps: z.number().int().min(3).max(20).default(10),
});

export const createInvestigation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.input<typeof createInput>) => createInput.parse(d))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    let payload: unknown;
    let ref: string;
    let targetType: string;
    let fileCount = 0;

    if (data.source.type === "github" || data.source.type === "upload") {
      const { extractZip, parseGithubUrl } = await import("./repo-loader");
      let files: { path: string; content: string }[];
      if (data.source.type === "github") {
        const gh = parseGithubUrl(data.source.url);
        if (!gh) throw new Error("That doesn't look like a GitHub repository link.");
        const { loadToken } = await import("./token.server");
        const token = await loadToken(context.userId);
        const headers: Record<string, string> = {
          "User-Agent": "recon-investigator",
          Accept: "application/vnd.github+json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(
          `https://api.github.com/repos/${gh.owner}/${gh.repo}/zipball${gh.ref ? `/${gh.ref}` : ""}`,
          { headers },
        );
        if (!res.ok)
          throw new Error(
            res.status === 404
              ? "Repository not found. If it is private, save a GitHub token in Settings."
              : `GitHub download failed (${res.status}).`,
          );
        files = extractZip(new Uint8Array(await res.arrayBuffer()));
        ref = `github.com/${gh.owner}/${gh.repo}${gh.ref ? `@${gh.ref}` : ""}`;
      } else {
        files = data.source.files;
        ref = data.source.name;
      }
      if (!files.length) throw new Error("No supported source files were found.");
      payload = { type: "repo", files };
      targetType = "repo";
      fileCount = files.length;
    } else if (data.source.type === "web") {
      const { crawlSite, isPublicHttpUrl } = await import("./web");
      if (!isPublicHttpUrl(data.source.url))
        throw new Error("Only public http/https URLs are allowed.");
      const site = await crawlSite(data.source.url);
      if (!site.pages.length) throw new Error("Could not fetch that site — no pages responded.");
      payload = { type: "web", site };
      ref = site.origin;
      targetType = "web";
      fileCount = site.pages.length;
    } else if (data.source.type === "runtime") {
      const { fingerprint, isPublicHttpUrl } = await import("./runtime");
      if (!isPublicHttpUrl(data.source.url))
        throw new Error("Only public http/https URLs are allowed.");
      const target = await fingerprint(data.source.url);
      if (!target.probes.some((p) => p.ok))
        throw new Error("The target did not respond to any probe.");
      payload = { type: "runtime", target };
      ref = target.baseUrl;
      targetType = "runtime";
      fileCount = target.probes.length;
    } else if (data.source.type === "visual") {
      payload = data.source;
      ref = data.source.name;
      targetType = "visual";
      fileCount = data.source.frames.length;
    } else {
      payload = { type: "binary", info: data.source.info, name: data.source.name };
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
      p_payload: payload as Json,
    });
    if (error || !id) throw new Error("Could not save the investigation and source data.");
    return { id, fileCount };
  });

export const advanceInvestigation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { advance } = await import("./agent.server");
    const { decodePayload } = await import("./payload");
    const sb = context.supabase;
    const { data: inv, error } = await sb
      .from("investigations")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !inv) throw new Error("Investigation not found");
    if (!["queued", "running"].includes(inv.status)) return { status: inv.status };
    const lease = crypto.randomUUID();
    const { data: claimed, error: claimError } = await sb.rpc("recon_claim", {
      p_id: data.id,
      p_lease: lease,
    });
    if (claimError) throw new Error("Could not claim the next investigation step.");
    if (!claimed?.length) return { status: inv.status, waiting: true };
    const checkpoint = claimed[0];
    if (!checkpoint) return { status: inv.status, waiting: true };
    const { data: idx } = await sb
      .from("repo_indexes")
      .select("files")
      .eq("investigation_id", data.id)
      .single();
    const payload = decodePayload(idx?.files);
    let renewing = false;
    const heartbeat = setInterval(async () => {
      if (renewing) return;
      renewing = true;
      try {
        await sb
          .from("investigations")
          .update({ lease_until: new Date(Date.now() + 180000).toISOString() })
          .eq("id", data.id)
          .eq("lease_id", lease);
      } finally {
        renewing = false;
      }
    }, 30000);
    const beforeWork = async () => {
      const { data: current, error: checkError } = await sb
        .from("investigations")
        .select("status,lease_id,revision")
        .eq("id", data.id)
        .single();
      if (
        checkError ||
        !current ||
        current.lease_id !== lease ||
        current.revision !== checkpoint.revision ||
        !["queued", "running"].includes(current.status)
      )
        throw new Error("Investigation paused or changed.");
    };

    const state = {
      question: checkpoint.question,
      status: checkpoint.status,
      step_count: checkpoint.step_count,
      max_steps: checkpoint.max_steps,
      steps: checkpoint.steps as never[],
      evidence: checkpoint.evidence as never[],
      hypotheses: checkpoint.hypotheses as never[],
      plan: checkpoint.plan as never,
    };
    try {
      await beforeWork();
      const out = await advance(state, payload, beforeWork);
      const { data: saved, error: saveError } = await sb
        .from("investigations")
        .update({
          lease_id: null,
          lease_until: null,
          revision: checkpoint.revision + 1,
          status: out.state.status,
          step_count: out.state.step_count,
          steps: out.state.steps as unknown as Json,
          evidence: out.state.evidence as unknown as Json,
          hypotheses: out.state.hypotheses as unknown as Json,
          plan: out.state.plan as unknown as Json,
          ...(out.report
            ? { report: out.report as unknown as Json, confidence: out.confidence }
            : {}),
        })
        .eq("id", data.id)
        .eq("lease_id", lease)
        .eq("revision", checkpoint.revision)
        .select("status")
        .maybeSingle();
      if (saveError)
        throw new Error(
          "Could not save this investigation step. Retry from the last saved checkpoint.",
        );
      return { status: saved?.status ?? "paused" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Investigation step failed";
      console.error("advance failed");
      state.steps.push({
        i: state.steps.length + 1,
        type: "error",
        title: "Investigation stopped",
        detail: msg,
        at: new Date().toISOString(),
      } as never);
      const { data: failed, error: failureError } = await sb
        .from("investigations")
        .update({
          status: "failed",
          error: msg,
          lease_id: null,
          lease_until: null,
          revision: checkpoint.revision + 1,
        })
        .eq("id", data.id)
        .eq("lease_id", lease)
        .eq("revision", checkpoint.revision)
        .select("id")
        .maybeSingle();
      if (failureError)
        throw new Error("Could not save the failure state. Refresh after a few minutes to retry.");
      if (!failed) return { status: "paused" };
      return { status: "failed", error: msg };
    } finally {
      clearInterval(heartbeat);
      await sb
        .from("investigations")
        .update({ lease_id: null, lease_until: null })
        .eq("id", data.id)
        .eq("lease_id", lease);
    }
  });

// ---------- GitHub token (private repos) ----------

export const saveGithubToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { token: string }) =>
    z.object({ token: z.string().min(10).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const check = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${data.token.trim()}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "recon-investigator",
      },
    });
    if (!check.ok)
      throw new Error(
        "GitHub did not accept this token. Check its validity and selected repository permissions.",
      );
    const { encryptToken } = await import("./token.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_secrets").upsert(
      {
        user_id: context.userId,
        key: "github_token",
        value: await encryptToken(data.token.trim()),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,key" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeGithubToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_secrets")
      .delete()
      .eq("user_id", context.userId)
      .eq("key", "github_token");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const hasGithubToken = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { loadToken } = await import("./token.server");
    const token = await loadToken(context.userId);
    return { saved: Boolean(token) };
  });
