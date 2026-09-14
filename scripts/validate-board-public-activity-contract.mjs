import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

const migrationPath='supabase/migrations/20260914090000_board_public_activity_read_v1.sql';
const migration=read(migrationPath);
const activity=read('public-activity-v1.js');
const activityCss=read('public-activity-v1.css');
const media=read('community/board/board-artifact-media-v1.js');
const mediaCss=read('community/board/board-artifact-media-v1.css');
const browser=read('scripts/validate-board-public-activity-browser.mjs');
const boardHtml=read('workspace/board/index.html');
const siteConfig=read('site-config.js');

assert(!exists('supabase/migrations/20260913162500_board_public_activity_read_v1.sql'),'stale out-of-order Activity migration timestamp remains');
assert(migration.includes('dc_public_activity_read_v1'),'public activity RPC missing');
assert(migration.includes("grant execute on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) to anon, authenticated"),'public activity RPC must be anon-safe');
assert(!/author_profile_id\s+uuid/.test(migration),'public activity return contract must not expose author_profile_id');
assert(!/storage_path\s+text/.test(migration),'public activity return contract must not expose storage_path');
assert(migration.includes("a.board_hidden_at is null"),'hidden Board artifacts must be excluded');
assert(migration.includes("a.status='active'"),'inactive Board artifacts must be excluded');
assert(migration.includes('(a.starts_at is null or a.starts_at<=now())'),'future Board artifacts must be excluded');
assert(migration.includes('(a.expires_at is null or a.expires_at>now())'),'expired Board artifacts must be excluded');
assert(migration.includes("(a.published_at,a.id) < (p_before_published_at,p_before_id)"),'cursor contract missing');
assert(migration.includes('youtube\\.com/shorts'),'YouTube Shorts parser missing');
assert(migration.includes('i.ytimg.com/vi/'),'YouTube thumbnail derivation missing');
assert(migration.includes("'/workspace/board/?focus=artifact:'"),'Board focus URL missing');

assert(activity.includes('railDuration'),'Home rail duration must derive from content');
assert(activity.includes("--dc-activity-duration"),'Home rail duration CSS variable missing');
assert(!activityCss.includes('46s'),'fixed 46s rail duration must not remain');
assert(activity.includes("inert"),'seamless clones must be inert');
assert(activity.includes('tabindex="-1"'),'clone links must be removed from keyboard order');
assert(activity.includes('loadMoreCommunity'),'Community load-more path missing');
assert(activity.includes('p_before_published_at:last.published_at'),'Community cursor timestamp missing');
assert(activity.includes('p_before_id:last.artifact_id'),'Community cursor id missing');
assert(activity.includes('ПОКАЗАТЬ ЕЩЁ'),'Community load-more control missing');
assert(activityCss.includes('scroll-snap-type:x mandatory'),'mobile scroll-snap missing');
assert(activityCss.includes('prefers-reduced-motion:reduce'),'reduced-motion guard missing');

for(const token of ['youtu.be','youtube.com','shorts','embed','watch'])assert(media.includes(token),`Board/Artifact YouTube parser missing ${token}`);
assert(media.includes(".dc-notice__link"),'Board YouTube presentation owner missing');
assert(media.includes(".dc-artifact-link"),'Artifact detail YouTube presentation owner missing');
assert(media.includes('VIDEO · YOUTUBE'),'literal YouTube label missing');
assert(media.includes('i.ytimg.com/vi/'),'Board/Artifact YouTube thumbnail missing');
assert(media.includes('new MutationObserver(apply)'),'Board/Artifact presentation must react directly to runtime render mutations');
assert(mediaCss.includes('.dc-youtube-presentation__play'),'YouTube play marker styles missing');
assert(siteConfig.includes("addScript('/public-activity-v1.js',{module:true})"),'public activity runtime not wired');
assert(siteConfig.includes("addScript('/community/board/board-artifact-media-v1.js',{module:true})"),'Board/Artifact media runtime not wired');

for(const token of ['width:390','width:360','PROFILE TEXT','PRIVATE IMAGE','HIDDEN FIXTURE','FUTURE FIXTURE','EXPIRED FIXTURE','assertRuntimeExclusions','Artifact detail presentation diagnostic'])assert(browser.includes(token),`browser evidence missing ${token}`);
assert(browser.includes('privateStoragePath'),'private-image fixture must carry a private storage path for leak evidence');
assert(browser.includes("eligibleIds"),'browser fixture must expose runtime eligibility evidence');

assert(!exists('community/board/board-admin-telegram-compose-v1.js'),'#172 must not contain Telegram composer JS');
assert(!exists('community/board/board-admin-telegram-compose-v1.css'),'#172 must not contain Telegram composer CSS');
assert(!boardHtml.includes('board-admin-telegram-compose-v1'),'Board Telegram opt-in wiring belongs to #176');
assert(!activity.includes('dc_admin_promote_artifact_telegram_v1'),'Activity runtime must not own Telegram write path');
assert(!media.includes('client.rpc='),'media presentation must not monkey-patch Supabase RPC');

console.log('Board public activity contract: OK');
