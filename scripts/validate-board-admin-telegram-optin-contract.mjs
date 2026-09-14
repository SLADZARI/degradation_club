import fs from 'node:fs';

const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const read=path=>fs.readFileSync(path,'utf8');
const runtime=read('community/board/board-admin-telegram-optin-v1.js');
const html=read('workspace/board/index.html');

expect(runtime.includes('ОТПРАВИТЬ В TELEGRAM ПОСЛЕ ПУБЛИКАЦИИ'),'missing literal OWNER_ADMIN opt-in label');
expect(runtime.includes('По умолчанию выключено. Публикация на Board не зависит от Telegram.'),'missing literal independent-Board supporting copy');
expect(runtime.includes('BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ'),'missing literal independent Telegram failure warning');
expect(runtime.includes("==='OWNER_ADMIN'"),'opt-in is not explicitly OWNER_ADMIN-gated');
expect(runtime.includes('type="checkbox"'),'opt-in checkbox missing');
expect(!/checked(?:\s|=|>)/.test(runtime),'Telegram opt-in must default OFF');
expect(runtime.includes("client.rpc('dc_admin_promote_artifact_telegram_v1'"),'existing Telegram promotion RPC is not reused');
expect((runtime.match(/dc_admin_promote_artifact_telegram_v1/g)||[]).length===1,'promotion RPC must have exactly one runtime callsite');
expect(runtime.includes(".eq('status','active')"),'post-submit continuation must confirm canonical active Artifact');
expect(runtime.includes('promotedArtifacts.has(artifact.id)'),'successful publish promotion lacks per-Artifact duplicate guard');
expect(runtime.includes('promotedArtifacts.add(artifact.id)'),'successful publish promotion does not record duplicate guard');
expect(!/client\.rpc\s*=/.test(runtime),'shared client.rpc must never be monkey-patched');
expect(!/\.rpc\s*=\s*(async\s*)?\(/.test(runtime),'RPC interposition detected');
expect(!runtime.includes('dc_enqueue_artifact_distribution_v1'),'opt-in must not create or revive legacy enqueue authority');
expect(!runtime.includes('insert('),'opt-in must not create a parallel Telegram queue');
expect(html.includes('board-admin-telegram-optin-v1.js'),'Board does not load Telegram opt-in runtime');
expect(html.includes('board-admin-telegram-optin-v1.css'),'Board does not load Telegram opt-in styles');

if(failures.length){
  console.error(`Board OWNER_ADMIN Telegram opt-in contract failed (${failures.length})`);
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Board OWNER_ADMIN Telegram opt-in contract PASS: owner-only, default OFF, post-success continuation, existing outbox authority, no RPC monkey-patch.');
