import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
export const Route = createFileRoute("/api/public/jobs/retention")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const failure = await authenticateCronRequest(request);
        if (failure) return failure;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("investigations")
          .select("id")
          .lte("expires_at", new Date().toISOString())
          .limit(500);
        if (error)
          return Response.json(
            { error: "Cleanup could not read expired investigations." },
            { status: 500 },
          );
        if (data?.length) {
          const { error: e } = await supabaseAdmin
            .from("investigations")
            .delete()
            .in(
              "id",
              data.map((r) => r.id),
            );
          if (e) return Response.json({ error: "Cleanup failed." }, { status: 500 });
        }
        return Response.json({ deleted: data?.length ?? 0 });
      },
    },
  },
});
