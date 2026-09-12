import { createClient } from "jsr:@supabase/supabase-js@2.112.4";

const clip = (value: string, max: number) => value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;

class KnownDeliveryFailure extends Error {}
class AmbiguousDeliveryOutcome extends Error {}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function requireServiceRequest(req: Request, serviceRoleKey: string) {
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${serviceRoleKey}`) throw new Error("SERVICE_ROLE_REQUIRED");
}

async function telegramCall(url: string, body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new AmbiguousDeliveryOutcome(`Telegram request outcome unknown: ${message}`);
  }

  const raw = await response.text();
  let payload: any = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    if (response.ok || response.status >= 500) {
      throw new AmbiguousDeliveryOutcome(`Telegram response outcome ambiguous: HTTP ${response.status}; ${clip(raw, 300)}`);
    }
    throw new KnownDeliveryFailure(`Telegram rejected request: HTTP ${response.status}; ${clip(raw, 300)}`);
  }

  // 5xx after request dispatch is not safe to auto-retry: Telegram may have
  // accepted the message before the upstream failure became visible to us.
  if (response.status >= 500) {
    throw new AmbiguousDeliveryOutcome(payload?.description || `Telegram server outcome ambiguous: HTTP ${response.status}`);
  }
  if (!response.ok || !payload?.ok) {
    throw new KnownDeliveryFailure(payload?.description || `Telegram rejected request: HTTP ${response.status}`);
  }

  return payload.result;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_COMMUNITY_CHAT_ID");

  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration missing", stage: "preflight" }, 530);
  if (!botToken || !chatId) return json({ error: "Telegram configuration missing", stage: "preflight" }, 531);

  try {
    requireServiceRequest(req, serviceRoleKey);
  } catch {
    return json({ error: "Trusted worker invocation required", stage: "auth" }, 403);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const requeue = await admin.rpc("dc_distribution_requeue_failed_v1", { p_limit: 5 });
    if (requeue.error) return json({ error: "Failed retry requeue unavailable", stage: "requeue", detail: requeue.error.message }, 532);

    const claimedResult = await admin.rpc("dc_distribution_claim_pending_v1", { p_limit: 5 });
    if (claimedResult.error) return json({ error: "Outbox claim unavailable", stage: "claim", detail: claimedResult.error.message }, 533);

    const claimed = Array.isArray(claimedResult.data) ? claimedResult.data : [];
    let sent = 0;
    let failed = 0;
    let unknown = 0;

    for (const row of claimed) {
      const outboxId = String(row.id || "");
      const artifactId = String(row.artifact_id || "");
      if (!outboxId || !artifactId) continue;

      try {
        const artifactResult = await admin
          .from("dc_artifacts")
          .select("id,title,body,external_url,status,visibility,author_profile_id,activity_at,board_hidden_at")
          .eq("id", artifactId)
          .maybeSingle();

        if (artifactResult.error) throw new KnownDeliveryFailure(`Artifact read failed: ${artifactResult.error.message}`);
        const artifact = artifactResult.data;
        if (!artifact || artifact.status !== "active" || artifact.visibility !== "community" || artifact.board_hidden_at) {
          throw new KnownDeliveryFailure("Artifact is no longer distributable");
        }

        const profileResult = await admin
          .from("profiles")
          .select("display_name,nickname")
          .eq("id", artifact.author_profile_id)
          .maybeSingle();
        if (profileResult.error) throw new KnownDeliveryFailure(`Author read failed: ${profileResult.error.message}`);

        const profile = profileResult.data;
        const author = String(profile?.display_name || profile?.nickname || "Участник клуба").trim();
        const artifactUrl = `https://dementor.club/community/artifact/${artifact.id}/`;
        const activity = artifact.activity_at ? `Когда: ${new Date(artifact.activity_at).toLocaleString("ru-RU", { timeZone: "Europe/Warsaw" })}` : "";
        const fullText = [
          "📌 DEMENTOR CLUB / ОБЩАЯ ДОСКА",
          artifact.title ? String(artifact.title).trim() : "",
          String(artifact.body || "").trim(),
          activity,
          `Автор: ${author}`,
          artifact.external_url ? `Внешняя ссылка: ${artifact.external_url}` : "",
          `Открыть на сайте: ${artifactUrl}`,
        ].filter(Boolean).join("\n\n");

        const mediaResult = await admin
          .from("dc_artifact_media")
          .select("storage_path,media_type")
          .eq("artifact_id", artifact.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (mediaResult.error) throw new KnownDeliveryFailure(`Media read failed: ${mediaResult.error.message}`);

        const media = mediaResult.data;
        let telegramResult: any = null;

        if (media?.storage_path && media.media_type === "image") {
          const signed = await admin.storage.from("dc-community-artifacts").createSignedUrl(media.storage_path, 600);
          if (signed.error) throw new KnownDeliveryFailure(`Signed media URL failed: ${signed.error.message}`);
          if (signed.data?.signedUrl) {
            telegramResult = await telegramCall(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              chat_id: chatId,
              photo: signed.data.signedUrl,
              caption: clip(fullText, 1000),
            });
          }
        }

        if (!telegramResult) {
          telegramResult = await telegramCall(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: clip(fullText, 3900),
            disable_web_page_preview: false,
          });
        }

        const marked = await admin.rpc("dc_distribution_mark_sent_v1", {
          p_outbox_id: outboxId,
          p_external_ref: String(telegramResult?.message_id || ""),
        });

        if (marked.error) {
          await admin.rpc("dc_distribution_mark_unknown_v1", {
            p_outbox_id: outboxId,
            p_error: `Telegram success confirmed but DB sent-state write failed: ${marked.error.message}`,
          });
          unknown += 1;
          continue;
        }

        sent += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (error instanceof AmbiguousDeliveryOutcome) {
          const marked = await admin.rpc("dc_distribution_mark_unknown_v1", { p_outbox_id: outboxId, p_error: clip(message, 500) });
          if (marked.error) console.error("[telegram-outbox-worker] could not persist delivery_unknown", { outboxId, detail: marked.error.message });
          unknown += 1;
        } else {
          const marked = await admin.rpc("dc_distribution_mark_failed_v1", { p_outbox_id: outboxId, p_error: clip(message, 500) });
          if (marked.error) console.error("[telegram-outbox-worker] could not persist failed", { outboxId, detail: marked.error.message });
          failed += 1;
        }
      }
    }

    return json({ ok: true, requeued: Number(requeue.data || 0), claimed: claimed.length, sent, failed, delivery_unknown: unknown, stage: "complete" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: "Worker failed", stage: "unhandled", detail: clip(message, 500) }, 534);
  }
});
