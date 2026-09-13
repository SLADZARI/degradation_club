import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

const migration=read('supabase/migrations/20260913162500_board_public_activity_read_v1.sql');
const activity=read('public-activity-v1.js');
const activityCss=read('public-activity-v1.css');
const telegram=read('community/board/board-admin-telegram-compose-v1.js');
const boardHtml=read('workspace/board/index.html');
const siteConfig=read('site-config.js');

assert(migration.includes('dc_public_activity_read_v1'),'public activity RPC missing');
assert(migration.includes("grant execute on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) to anon, authenticated"),'public activity RPC must be anon-safe');
assert(!/author_profile_id\s+uuid/.test(migration),'public activity return contract must not expose author_profile_id');
assert(!/storage_path\s+text/.test(migration),'public activity return contract must not expose storage_path');
assert(migration.includes("a.board_hidden_at is null"),'hidden Board artifacts must be excluded');
assert(migration.includes("a.status='active'"),'inactive Board artifacts must be excluded');
assert(migration.includes('youtube.com/shorts'),'YouTube Shorts parser missing');
assert(migration.includes('i.ytimg.com/vi/'),'YouTube thumbnail derivation missing');
assert(migration.includes("'/workspace/board/?focus=artifact:'"),'Board focus URL missing');

assert(activity.includes('СЕЙЧАС В КЛУБЕ'),'public activity heading missing');
assert(activity.includes(".dc-home-community"),'Home rail must mount before Community surface');
assert(activity.includes("section.live"),'Community activity replacement owner missing');
assert(activity.includes("dc_public_activity_read_v1"),'public activity UI must consume canonical RPC');
assert(activity.includes('ОТКРЫТЬ НА BOARD'),'cards must bridge back to Board');
assert(activityCss.includes('animation:dcActivityRail'),'desktop rail animation missing');
assert(activityCss.includes('animation-play-state:paused'),'hover/focus pause missing');
assert(activityCss.includes('scroll-snap-type:x mandatory'),'mobile scroll-snap missing');
assert(activityCss.includes('prefers-reduced-motion:reduce'),'reduced-motion guard missing');

assert(telegram.includes('admin_send_telegram'),'OWNER_ADMIN Telegram checkbox missing');
assert(telegram.includes("dc_admin_promote_artifact_telegram_v1"),'Telegram checkbox must reuse canonical promotion RPC');
assert(telegram.includes("name!=='dc_publish_artifact_v1'"),'Telegram opt-in must be coupled only to successful Board publish command');
assert(telegram.includes('BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ'),'partial failure state missing');
assert(boardHtml.includes('board-admin-telegram-compose-v1.js'),'Board Telegram opt-in module not wired');
assert(boardHtml.includes('board-admin-telegram-compose-v1.css'),'Board Telegram opt-in styles not wired');
assert(siteConfig.includes("addScript('/public-activity-v1.js',{module:true})"),'public activity runtime not wired');
assert(siteConfig.includes("addStyle('/public-activity-v1.css')"),'public activity styles not wired');

console.log('Board public activity contract: OK');
