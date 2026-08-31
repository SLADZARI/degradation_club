import { withSupabase } from "npm:@supabase/server@^1";
import { corsHeaders as supabaseCorsHeaders } from "jsr:@supabase/supabase-js@2.112.4/cors";

const clip = (value: string, max: number) => value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
const allowedOrigins = new Set(["https://dementor.club", "https://www.dementor.club"]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "https://dementor.club";
  return {
    ...supabaseCorsHeaders,
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function withCors(req: Request, response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(req))) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const app = withSupabase({ auth: "user" }, async (_req: Request, ctx: any) => {
  const admin = ctx.supabaseAdmin;
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_COMMUNITY_CHAT_ID");

  try {
    const now = new Date().toISOString();
    const { data: queue, error: queueError } = await admin
      .from("dc_distribution_outbox")
      .select("id,artifact_id,status,attempts")
      .in("status", ["pending", "failed"])
      .lte("available_at", now)
      .lt("attempts", 5)
      .order("created_at", { ascending: true })
      .limit(5);

    if (queueError) {
      return Response.json({ error: "Outbox unavailable", stage: "outbox-read", detail: queueError.message }, { status: 533 });
    }

    let processed = 0;
    let sent = 0;
    let failed = 0;

    for (const row of queue || []) {
      const attempt = Number(row.attempts || 0) + 1;
      const { data: claimed, error: claimError } = await admin
        .from("dc_distribution_outbox")
        .update({
          status: "processing",
          locked_at: new Date().toISOString(),
          attempts: attempt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("status", row.status)
        .select("id")
        .maybeSingle();

      if (claimError || !claimed) continue;
      processed += 1;

      try {
        const { data: artifact, error: artifactError } = await admin
          .from("dc_artifacts")
          .select("id,title,body,external_url,status,visibility,author_profile_id")
          .eq("id", row.artifact_id)
          .maybeSingle();

        if (artifactError) throw artifactError;
        if (!artifact || artifact.status !== "active" || artifact.visibility !== "community") {
          throw new Error("Artifact is no longer distributable");
        }

        const { data: profile } = await admin
          .from("profiles")
          .select("display_name,nickname")
          .eq("id", artifact.author_profile_id)
          .maybeSingle();

        const author = String(profile?.display_name || profile?.nickname || "Участник клуба").trim();
        const artifactUrl = `https://dementor.club/community/artifact/${artifact.id}/`;
        const fullText = [
          "📌 DEMENTOR CLUB / ОБЩАЯ ДОСКА",
          artifact.title ? String(artifact.title).trim() : "",
          String(artifact.body || "").trim(),
          `Автор: ${author}`,
          artifact.external_url ? `Внешняя ссылка: ${artifact.external_url}` : "",
          `Открыть на сайте: ${artifactUrl}`,
        ].filter(Boolean).join("\n\n");

        const { data: media } = await admin
          .from("dc_artifact_media")
          .select("storage_path,media_type")
          .eq("artifact_id", artifact.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        let telegramResult: any = null;

        if (media?.storage_path && media.media_type === "image") {
          const { data: signed, error: signedError } = await admin.storage
            .from("dc-community-artifacts")
            .createSignedUrl(media.storage_path, 600);

          if (signedError) throw signedError;

          if (signed?.signedUrl) {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                photo: signed.signedUrl,
                caption: clip(fullText, 1000),
              }),
            });

            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
              throw new Error(payload?.description || `Telegram sendPhoto HTTP ${response.status}`);
            }
            telegramResult = payload.result;
          }
        }

        if (!telegramResult) {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: clip(fullText, 3900),
              disable_web_page_preview: false,
            }),
          });

          const payload = await response.json();
          if (!response.ok || !payload?.ok) {
            throw new Error(payload?.description || `Telegram sendMessage HTTP ${response.status}`);
          }
          telegramResult = payload.result;
        }

        await admin
          .from("dc_distribution_outbox")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            locked_at: null,
            external_ref: String(telegramResult?.message_id || ""),
            last_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);

        sent += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        await admin
          .from("dc_distribution_outbox")
          .update({
            status: "failed",
            locked_at: null,
            last_error: clip(message, 500),
            available_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);

        failed += 1;
      }
    }

    return Response.json({ ok: true, processed, sent, failed, stage: "complete" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "Worker failed", stage: "unhandled", detail: clip(message, 500) }, { status: 534 });
  }
});

export default {
  async fetch(req: Request) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_COMMUNITY_CHAT_ID");

    if (!botToken && !chatId) {
      return withCors(req, Response.json({ error: "Telegram secrets missing", stage: "pre-wrapper", botTokenPresent: false, chatIdPresent: false }, { status: 530 }));
    }
    if (!botToken) {
      return withCors(req, Response.json({ error: "Telegram bot token missing", stage: "pre-wrapper", botTokenPresent: false, chatIdPresent: true }, { status: 531 }));
    }
    if (!chatId) {
      return withCors(req, Response.json({ error: "Telegram chat id missing", stage: "pre-wrapper", botTokenPresent: true, chatIdPresent: false }, { status: 532 }));
    }

    try {
      return withCors(req, await app.fetch(req));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return withCors(req, Response.json({ error: "Supabase wrapper failed", stage: "with-supabase", detail: clip(message, 500) }, { status: 535 }));
    }
  },
};
