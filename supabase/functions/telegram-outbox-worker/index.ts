import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const clip = (value: string, max: number) => value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;

function resolveAdminKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return { key: legacy, source: "SUPABASE_SERVICE_ROLE_KEY", parseState: "legacy" };

  const current = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!current) return { key: null, source: null, parseState: "SUPABASE_SECRET_KEYS_MISSING" };

  try {
    const keys = JSON.parse(current);
    if (keys && typeof keys === "object") {
      if (typeof keys.default === "string" && keys.default) {
        return { key: keys.default, source: "SUPABASE_SECRET_KEYS.default", parseState: "ok" };
      }
      const first = Object.entries(keys).find(([, value]) => typeof value === "string" && value);
      if (first) return { key: String(first[1]), source: `SUPABASE_SECRET_KEYS.${first[0]}`, parseState: "fallback" };
      return { key: null, source: null, parseState: "SUPABASE_SECRET_KEYS_EMPTY" };
    }
    return { key: null, source: null, parseState: "SUPABASE_SECRET_KEYS_NOT_OBJECT" };
  } catch {
    return { key: null, source: null, parseState: "SUPABASE_SECRET_KEYS_INVALID_JSON" };
  }
}

function safeEnvSnapshot() {
  const names = Object.keys(Deno.env.toObject()).filter((name) => name.startsWith("SUPABASE_") || name.startsWith("TELEGRAM_"));
  return {
    names,
    supabaseUrl: Boolean(Deno.env.get("SUPABASE_URL")),
    legacyServiceRole: Boolean(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")),
    secretKeysBundle: Boolean(Deno.env.get("SUPABASE_SECRET_KEYS")),
    botToken: Boolean(Deno.env.get("TELEGRAM_BOT_TOKEN")),
    chatId: Boolean(Deno.env.get("TELEGRAM_COMMUNITY_CHAT_ID")),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const env = safeEnvSnapshot();
    const adminResolution = resolveAdminKey();
    console.log("[telegram-worker] env", JSON.stringify({ ...env, adminKeySource: adminResolution.source, adminParseState: adminResolution.parseState }));

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const adminKey = adminResolution.key;
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_COMMUNITY_CHAT_ID");

    if (!supabaseUrl || !adminKey) {
      console.error("[telegram-worker] stage=runtime-secrets status=failed", JSON.stringify({ supabaseUrl: Boolean(supabaseUrl), adminKeySource: adminResolution.source, adminParseState: adminResolution.parseState }));
      return json({ error: "Supabase runtime secrets are unavailable", stage: "runtime-secrets", adminKeySource: adminResolution.source, adminParseState: adminResolution.parseState }, 500);
    }
    if (!botToken || !chatId) {
      console.error("[telegram-worker] stage=telegram-secrets status=failed", JSON.stringify({ botToken: Boolean(botToken), chatId: Boolean(chatId) }));
      return json({ error: "Telegram secrets are not configured", stage: "telegram-secrets", botTokenPresent: Boolean(botToken), chatIdPresent: Boolean(chatId) }, 500);
    }

    console.log("[telegram-worker] stage=admin-client status=starting", JSON.stringify({ adminKeySource: adminResolution.source }));
    const admin = createClient(supabaseUrl, adminKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

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
      console.error("[telegram-worker] stage=outbox-read status=failed", queueError.message);
      return json({ error: "Outbox unavailable", stage: "outbox-read", detail: queueError.message }, 500);
    }

    console.log("[telegram-worker] stage=outbox-read status=ok", JSON.stringify({ rows: queue?.length || 0 }));
    let processed = 0;
    let sent = 0;
    let failed = 0;

    for (const row of queue || []) {
      const attempt = Number(row.attempts || 0) + 1;
      const { data: claimed, error: claimError } = await admin
        .from("dc_distribution_outbox")
        .update({ status: "processing", locked_at: new Date().toISOString(), attempts: attempt, updated_at: new Date().toISOString() })
        .eq("id", row.id)
        .eq("status", row.status)
        .select("id")
        .maybeSingle();

      if (claimError || !claimed) {
        console.warn("[telegram-worker] stage=claim status=skipped", JSON.stringify({ queueId: row.id, error: claimError?.message || null }));
        continue;
      }
      processed += 1;

      try {
        const { data: artifact, error: artifactError } = await admin
          .from("dc_artifacts")
          .select("id,title,body,external_url,status,visibility,author_profile_id")
          .eq("id", row.artifact_id)
          .maybeSingle();
        if (artifactError) throw artifactError;
        if (!artifact || artifact.status !== "active" || artifact.visibility !== "community") throw new Error("Artifact is no longer distributable");

        const { data: profile } = await admin
          .from("profiles")
          .select("display_name,nickname")
          .eq("id", artifact.author_profile_id)
          .maybeSingle();
        const author = String(profile?.display_name || profile?.nickname || "Участник клуба").trim();

        const artifactUrl = `https://dementor.club/community/artifact/${artifact.id}/`;
        const parts = [
          "📌 DEMENTOR CLUB / ОБЩАЯ ДОСКА",
          artifact.title ? String(artifact.title).trim() : "",
          String(artifact.body || "").trim(),
          `Автор: ${author}`,
          artifact.external_url ? `Внешняя ссылка: ${artifact.external_url}` : "",
          `Открыть на сайте: ${artifactUrl}`,
        ].filter(Boolean);
        const fullText = parts.join("\n\n");

        const { data: media } = await admin
          .from("dc_artifact_media")
          .select("storage_path,media_type")
          .eq("artifact_id", artifact.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        let telegramResult: any = null;
        if (media?.storage_path && media.media_type === "image") {
          const { data: signed, error: signedError } = await admin.storage.from("dc-community-artifacts").createSignedUrl(media.storage_path, 600);
          if (signedError) console.warn("[telegram-worker] stage=signed-url status=failed", signedError.message);
          if (signed?.signedUrl) {
            console.log("[telegram-worker] stage=telegram-sendPhoto status=starting", JSON.stringify({ queueId: row.id }));
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, photo: signed.signedUrl, caption: clip(fullText, 1000) }),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) throw new Error(payload?.description || `Telegram sendPhoto HTTP ${response.status}`);
            telegramResult = payload.result;
          }
        }

        if (!telegramResult) {
          console.log("[telegram-worker] stage=telegram-sendMessage status=starting", JSON.stringify({ queueId: row.id }));
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: clip(fullText, 3900), disable_web_page_preview: false }),
          });
          const payload = await response.json();
          if (!response.ok || !payload?.ok) throw new Error(payload?.description || `Telegram sendMessage HTTP ${response.status}`);
          telegramResult = payload.result;
        }

        await admin.from("dc_distribution_outbox").update({
          status: "sent",
          sent_at: new Date().toISOString(),
          locked_at: null,
          external_ref: String(telegramResult?.message_id || ""),
          last_error: null,
          updated_at: new Date().toISOString(),
        }).eq("id", row.id);
        console.log("[telegram-worker] stage=telegram status=sent", JSON.stringify({ queueId: row.id, messageId: telegramResult?.message_id || null }));
        sent += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[telegram-worker] stage=distribution status=failed", JSON.stringify({ queueId: row.id, message: clip(message, 500) }));
        await admin.from("dc_distribution_outbox").update({
          status: "failed",
          locked_at: null,
          last_error: clip(message, 500),
          available_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", row.id);
        failed += 1;
      }
    }

    return json({ ok: true, processed, sent, failed, stage: "complete" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[telegram-worker] stage=unhandled status=failed", clip(message, 500));
    return json({ error: "Worker failed before queue processing", stage: "unhandled", detail: clip(message, 500) }, 500);
  }
});
