import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&cfg.url&&cfg.publishableKey){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data,error}=await client.from('dc_merch_items').select('sku,title,item_type,base_price_eur,sales_state,public_visible,updated_at').eq('public_visible',true);
  if(!error){
    const items=new Map((data||[]).map(x=>[x.sku,x]));
    const money=v=>v==null?'PRICE UNAVAILABLE':`€${Number(v).toLocaleString('en-US',{maximumFractionDigits:2})}`;
    const state=v=>v?String(v).replace(/_/g,' ').toUpperCase():'STATUS UNAVAILABLE';
    const path=location.pathname;
    const fact=(label,value)=>document.querySelectorAll('.dc-product__fact,.dc-object-fact').forEach(row=>{const l=row.querySelector('span');if(l&&l.textContent.trim().toLowerCase()===label.toLowerCase()){const out=row.querySelector('strong');if(out)out.textContent=value}});

    if(path.endsWith('/merch/')||path.endsWith('/merch/index.html')){
      const obj=items.get('DC-OBJECT-001');
      const objRow=[...document.querySelectorAll('.dc-entity-row')].find(x=>x.textContent.includes('НЕ НАДО'));
      if(objRow){const st=objRow.querySelector('.dc-entity-row__status');if(st)st.textContent=obj?`${money(obj.base_price_eur)} / ${state(obj.sales_state)}`:'PRICE UNAVAILABLE / STATUS UNAVAILABLE'}

      document.querySelectorAll('.dc-drop-card').forEach(card=>{
        const sku=card.querySelector('.dc-drop-card__id')?.textContent?.trim();
        const item=sku?items.get(sku):null;
        const spans=card.querySelectorAll('.dc-drop-card__state span');
        if(spans[0])spans[0].textContent=item?money(item.base_price_eur):'PRICE UNAVAILABLE';
        if(spans[1])spans[1].textContent=item?state(item.sales_state):'STATUS UNAVAILABLE';
      });

      const states=[...items.values()].map(x=>x.sales_state);
      const open=states.filter(x=>['available','preorder'].includes(x)).length;
      const facts=document.querySelectorAll('.dc-entity-hero__facts p');
      if(facts[1])facts[1].textContent=open?`OPEN ITEMS / ${open}`:'SALES / NOT OPEN';
      if(facts[2])facts[2].textContent=`LIVE ITEMS / ${items.size}`;
    }

    const routes={
      '/objects/001-ne-nado/':'DC-OBJECT-001',
      '/merch/drop-001/overthinking-is-my-cardio/':'SH-DEM-01',
      '/merch/drop-001/personal-growth-cancelled/':'SH-DEM-02',
      '/merch/drop-001/success-is-boring/':'SH-DEM-03',
      '/merch/drop-001/potential-too-long-revealed/':'SH-DEM-04'
    };
    const route=Object.keys(routes).find(r=>path.endsWith(r)||path.endsWith(r+'index.html'));
    if(route){
      const sku=routes[route],item=items.get(sku);
      const price=item?money(item.base_price_eur):'PRICE UNAVAILABLE';
      const sales=item?state(item.sales_state):'STATUS UNAVAILABLE';
      document.documentElement.dataset.dcMerchState=item?.sales_state||'unavailable';
      fact('Price',price);
      fact('Availability',sales);
      const heroPrice=document.querySelector('.dc-object-hero__price');if(heroPrice)heroPrice.textContent=price;
      const heroState=document.querySelector('.dc-object-hero__state');if(heroState)heroState.innerHTML=`SALES / ${sales}<br>EDITION / 50`;
      const meta=document.querySelector('.dc-product__meta span:last-child,.dc-object-hero__meta span:last-child');if(meta)meta.textContent=`${sku} / ${price} / ${sales}`;
      document.querySelectorAll('[data-dc-commerce-action]').forEach(el=>{const canCheckout=Boolean(item&&['available','preorder'].includes(item.sales_state)&&window.DEMENTOR_SITE_CONFIG?.merch?.checkoutEnabled);el.hidden=!canCheckout;el.setAttribute('aria-disabled',String(!canCheckout))});
    }
  }else console.warn('[DC merch runtime]',error);
}
