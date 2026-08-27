// Dementor Club — local-first cart. Anonymous state stays in localStorage; authenticated state syncs to Supabase.
(()=>{
  const KEY='dementorClubCartV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"items":[]}')}catch(_){return{items:[]}}};
  const write=state=>{localStorage.setItem(KEY,JSON.stringify(state));document.dispatchEvent(new CustomEvent('dc:cart-change',{detail:state}));return state};
  const same=(a,b)=>a.sku===b.sku&&(a.variantLabel||'')===(b.variantLabel||'')&&(a.size||'')===(b.size||'');
  const api={
    get:read,
    count:()=>read().items.reduce((n,x)=>n+(x.quantity||1),0),
    total:()=>read().items.reduce((n,x)=>n+(Number(x.unitPriceEur)||0)*(x.quantity||1),0),
    add(item){const s=read();const i=s.items.find(x=>same(x,item));if(i)i.quantity=Math.min(99,(i.quantity||1)+(item.quantity||1));else s.items.push({...item,quantity:item.quantity||1});write(s);syncRemote().catch(()=>{});return s},
    remove(index){const s=read();s.items.splice(index,1);write(s);syncRemote().catch(()=>{});return s},
    setQuantity(index,q){const s=read();if(!s.items[index])return s;q=Math.max(1,Math.min(99,Number(q)||1));s.items[index].quantity=q;write(s);syncRemote().catch(()=>{});return s},
    clear(){const s=write({items:[]});syncRemote().catch(()=>{});return s}
  };
  window.DEMENTOR_CART=api;

  let client=null,session=null;
  async function getClient(){if(client)return client;const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;if(!cfg?.enabled)return null;const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');client=mod.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}});const {data}=await client.auth.getSession();session=data.session||null;client.auth.onAuthStateChange((_e,s)=>{session=s||null;if(session)mergeRemote().catch(()=>{})});return client}
  async function activeCart(){if(!session)return null;const c=await getClient();let {data}=await c.from('carts').select('id').eq('profile_id',session.user.id).eq('status','active').maybeSingle();if(data)return data.id;const ins=await c.from('carts').insert({profile_id:session.user.id,status:'active'}).select('id').single();if(ins.error)throw ins.error;return ins.data.id}
  async function mergeRemote(){const c=await getClient();if(!c||!session)return;const id=await activeCart();const remote=await c.from('cart_items').select('*').eq('cart_id',id);if(remote.error)throw remote.error;const local=read();(remote.data||[]).forEach(r=>{const item={productId:r.product_id,sku:r.sku,title:r.title,variantId:r.variant_id,variantLabel:r.variant_label,size:r.size,unitPriceEur:Number(r.unit_price_eur),quantity:r.quantity,metadata:r.metadata||{}};const hit=local.items.find(x=>same(x,item));if(hit)hit.quantity=Math.max(hit.quantity||1,item.quantity||1);else local.items.push(item)});write(local);await syncRemote()}
  async function syncRemote(){const c=await getClient();if(!c||!session)return;const id=await activeCart();const local=read();const del=await c.from('cart_items').delete().eq('cart_id',id);if(del.error)throw del.error;if(!local.items.length)return;const rows=local.items.map(x=>({cart_id:id,product_id:x.productId||x.sku,sku:x.sku,title:x.title,variant_id:x.variantId||null,variant_label:x.variantLabel||null,size:x.size||null,unit_price_eur:Number(x.unitPriceEur)||0,quantity:x.quantity||1,metadata:x.metadata||{}}));const ins=await c.from('cart_items').insert(rows);if(ins.error)throw ins.error}

  function badge(){let a=document.querySelector('[data-dc-cart-link]');if(!a){a=document.createElement('a');a.href='/cart/';a.dataset.dcCartLink='1';a.style.cssText='position:fixed;right:18px;bottom:18px;z-index:230;background:#d8ff3e;color:#111;padding:11px 14px;border:1px solid #111;font:800 11px/1 Inter,Arial,sans-serif;text-decoration:none;letter-spacing:.06em';document.body.appendChild(a)}a.textContent=`CART / ${api.count()}`}
  document.addEventListener('dc:cart-change',badge);document.readyState==='loading'?document.addEventListener('DOMContentLoaded',badge,{once:true}):badge();
  getClient().then(()=>session&&mergeRemote()).catch(()=>{});
})();