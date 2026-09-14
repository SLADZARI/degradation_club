import fs from 'node:fs';
import path from 'node:path';

const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const read=path=>fs.readFileSync(path,'utf8');
const runtime=read('community/board/board-admin-telegram-optin-v1.js');
const board=read('community/board/board.js');
const html=read('workspace/board/index.html');
const promotionSql=read('supabase/migrations/20260912144034_board_telegram_promotion_v1.sql');
const schedulerSql=read('supabase/migrations/20260912173340_board_telegram_worker_scheduler_v1.sql');

function walkJs(dir){
  if(!fs.existsSync(dir))return[];
  const files=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...walkJs(full));
    else if(entry.isFile()&&entry.name.endsWith('.js'))files.push(full);
  }
  return files;
}

expect(runtime.includes('ОТПРАВИТЬ В TELEGRAM ПОСЛЕ ПУБЛИКАЦИИ'),'missing literal OWNER_ADMIN opt-in label');
expect(runtime.includes('По умолчанию выключено. Публикация на Board не зависит от Telegram.'),'missing literal independent-Board supporting copy');
expect(runtime.includes('BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ'),'missing literal independent Telegram failure warning');
expect(runtime.includes("==='OWNER_ADMIN'"),'opt-in is not explicitly OWNER_ADMIN-gated');
expect(runtime.includes('type="checkbox"'),'opt-in checkbox missing');
expect(!/data-admin-telegram-optin-input[^>]*\schecked(?:\s|=|>)/.test(runtime),'Telegram opt-in must default OFF');
expect(runtime.includes("const PUBLISHED_EVENT='dc:board:artifact-published'"),'Telegram continuation is not bound to the narrow canonical success signal');
expect(board.includes("window.dispatchEvent(new CustomEvent('dc:board:artifact-published',{detail:{artifactId}}));"),'canonical Board publish owner does not emit exact Artifact success signal');
expect(board.indexOf("dc_publish_artifact_v1")<board.indexOf("dc:board:artifact-published"),'success signal must occur after canonical publish RPC');
expect(runtime.includes("client.rpc('dc_admin_promote_artifact_telegram_v1'"),'existing Telegram promotion RPC is not reused');
expect((runtime.match(/dc_admin_promote_artifact_telegram_v1/g)||[]).length===1,'opt-in runtime must have exactly one promotion RPC callsite');
expect(runtime.includes('promotedArtifacts.has(artifactId)'),'successful publish promotion lacks exact-id duplicate guard');
expect(runtime.includes('promotedArtifacts.add(artifactId)'),'successful publish promotion does not record exact-id duplicate guard');
expect(!runtime.includes('published_at'),'Telegram continuation must not infer Artifact identity from publish timestamps');
expect(!runtime.includes('Date.now'),'Telegram continuation must not depend on browser clock');
expect(!runtime.includes("from('dc_artifacts')"),'Telegram continuation must not search canonical artifacts to infer identity');
expect(!runtime.includes('artifactTitle')&&!runtime.includes('artifactBody'),'Telegram continuation must not match Artifact identity by title/body');
expect(!/client\.rpc\s*=/.test(runtime),'shared client.rpc must never be monkey-patched');
expect(!/\.rpc\s*=\s*(async\s*)?\(/.test(runtime),'RPC interposition detected');
expect(!runtime.includes('dc_enqueue_artifact_distribution_v1'),'opt-in must not create or revive legacy enqueue authority');
expect(!runtime.includes('insert('),'opt-in must not create a parallel Telegram queue');

// #176 single frontend owner: legacy per-card admin override UI is retired.
expect(!board.includes('dc_admin_promote_artifact_telegram_v1'),'board.js must not own a second OWNER_ADMIN promotion callsite');
expect(!board.includes('data-admin-promote'),'legacy per-card Telegram promote control/binding must be absent');
expect(!board.includes('ОПУБЛИКОВАТЬ В TELEGRAM'),'legacy per-card Telegram promote label must be absent');
const frontendFiles=[...walkJs('community'),...walkJs('workspace')];
const frontendCallsites=frontendFiles.flatMap(file=>{
  const text=read(file);
  const count=(text.match(/dc_admin_promote_artifact_telegram_v1/g)||[]).length;
  return Array.from({length:count},()=>file);
});
expect(frontendCallsites.length===1&&frontendCallsites[0].endsWith('community/board/board-admin-telegram-optin-v1.js'),`expected one frontend promotion owner, found: ${frontendCallsites.join(', ')||'none'}`);

// Actual backend state machine: publish=held; only explicit promotion/support can release to pending; worker ignores held.
expect(/insert into public\.dc_distribution_outbox[\s\S]*?'telegram'[\s\S]*?'held'/m.test(promotionSql),'canonical publish must create Telegram outbox in held');
expect(/'telegram_status','held'/.test(promotionSql),'canonical publish result must report telegram_status held');
expect(/if v_status='held' then[\s\S]*?set status='pending'/m.test(promotionSql),'OWNER_ADMIN promotion RPC must release held to pending');
expect(/v_count >= v_threshold and v_outbox\.status='held'[\s\S]*?set status='pending'/m.test(promotionSql),'support path must require threshold before held to pending');
expect(/select 2;/.test(promotionSql),'canonical promotion threshold changed from expected 2');
expect(/o\.status='pending'/.test(schedulerSql),'worker scheduler must recognize pending work');
expect(!/o\.status='held'/.test(schedulerSql),'worker scheduler must never treat held as actionable work');

expect(html.includes('board-admin-telegram-optin-v1.js'),'Board does not load Telegram opt-in runtime');
expect(html.includes('board-admin-telegram-optin-v1.css'),'Board does not load Telegram opt-in styles');

if(failures.length){
  console.error(`Board OWNER_ADMIN Telegram opt-in contract failed (${failures.length})`);
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Board OWNER_ADMIN Telegram opt-in contract PASS: single frontend promotion owner; OFF backend invariant held; ON release pending; held is not worker-actionable.');
