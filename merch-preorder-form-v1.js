(()=>{
  if(typeof document!=='undefined'&&!document.querySelector('script[src="/support-v1.js"]')){const support=document.createElement('script');support.src='/support-v1.js';support.defer=true;document.body.appendChild(support)}
  const mounts=[...document.querySelectorAll('[data-dc-preorder-form]')];
  if(!mounts.length)return;

  const sizes=['XXS','XS','S','M','L','XL','XXL','3XL'];
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const refId=()=>`DC-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random()*90+10)}`;
  const objectProduct={sku:'DC-OBJECT-001',title:'OBJECT 001 — НЕ НАДО',price:520,hasSizes:false,variants:[],personalised:true};
  const objectImages=['/assets/objects/object-001/object-001-hero-3q.webp','/assets/objects/object-001/object-001-top.webp','/assets/objects/object-001/object-001-back.webp','/assets/objects/object-001/object-001-macro-front.webp','/assets/objects/object-001/object-001-packaging.webp'];

  const lock=()=>document.documentElement.classList.add('dc-modal-open');
  const unlock=()=>document.documentElement.classList.remove('dc-modal-open');
  const closeAll=()=>{document.querySelectorAll('.dc-commerce-modal.is-open').forEach(x=>x.classList.remove('is-open'));unlock();};
  const announcePreorder=()=>document.dispatchEvent(new CustomEvent('dc:preorder-open'));

  mounts.forEach(mount=>{
    const variants=(mount.dataset.variants||'').split('|').filter(Boolean).map(row=>{const [label,p]=row.split(':');return{label,price:Number(p||mount.dataset.price||0)}});
    const pageProduct={sku:mount.dataset.sku||'SKU',title:mount.dataset.title||mount.dataset.sku||'PRODUCT',price:Number(mount.dataset.price||0),hasSizes:mount.dataset.sizes!=='false',variants,personalised:(mount.dataset.sku||'')==='DC-OBJECT-001'};

    mount.innerHTML=`<div class="dc-commerce-actions"><button class="dc-commerce-action dc-commerce-action--primary" type="button" data-open-preorder>PREORDER <span>→</span></button>${pageProduct.sku!=='DC-OBJECT-001'?'<button class="dc-commerce-action dc-commerce-action--object" type="button" data-open-object>НЕ НАДО <span>↗</span></button>':''}</div>`;

    const preorder=document.createElement('div');
    preorder.className='dc-commerce-modal dc-commerce-modal--order';
    preorder.innerHTML=`<div class="dc-commerce-modal__backdrop" data-close-modal></div><section class="dc-commerce-modal__panel" role="dialog" aria-modal="true" aria-label="Preorder"><button class="dc-commerce-modal__close" type="button" data-close-modal>×</button><div data-order-shell></div></section>`;
    document.body.appendChild(preorder);

    let objectModal=null;
    if(pageProduct.sku!=='DC-OBJECT-001'){
      objectModal=document.createElement('div');
      objectModal.className='dc-commerce-modal dc-commerce-modal--object';
      objectModal.innerHTML=`<div class="dc-commerce-modal__backdrop" data-close-modal></div><section class="dc-commerce-modal__panel dc-object-quickview" role="dialog" aria-modal="true" aria-label="OBJECT 001 — НЕ НАДО"><button class="dc-commerce-modal__close" type="button" data-close-modal>×</button><div class="dc-object-quickview__media"><img src="${objectImages[0]}" alt="OBJECT 001 — НЕ НАДО" data-object-image><button type="button" data-object-prev>←</button><button type="button" data-object-next>→</button><div class="dc-object-quickview__count"><span data-object-index>01</span> / 05</div></div><div class="dc-object-quickview__copy"><span class="dc-meta">DEMENTOR OBJECTS / DROP 001</span><h2>НЕ<br>НАДО</h2><p>Тяжёлый латунный аргумент в пользу того, чтобы ничего лишнего не делать.</p><div class="dc-object-quickview__facts"><span>SOLID BRASS</span><span>100 × 40 × 20 MM</span><span>EDITION / 50</span><span>OWNER MARK / REQUIRED</span></div><div class="dc-object-quickview__price">€520</div><button class="dc-commerce-action dc-commerce-action--primary" type="button" data-object-preorder>PREORDER <span>→</span></button></div></section>`;
      document.body.appendChild(objectModal);
      let slide=0;
      const syncSlide=()=>{objectModal.querySelector('[data-object-image]').src=objectImages[slide];objectModal.querySelector('[data-object-index]').textContent=String(slide+1).padStart(2,'0');};
      objectModal.querySelector('[data-object-prev]').addEventListener('click',()=>{slide=(slide-1+objectImages.length)%objectImages.length;syncSlide();});
      objectModal.querySelector('[data-object-next]').addEventListener('click',()=>{slide=(slide+1)%objectImages.length;syncSlide();});
      objectModal.querySelector('[data-object-preorder]').addEventListener('click',()=>{announcePreorder();objectModal.classList.remove('is-open');renderOrder(objectProduct);preorder.classList.add('is-open');});
    }

    const renderOrder=(product)=>{
      const shell=preorder.querySelector('[data-order-shell]');
      const defaultVariant=product.variants[0]?.label||'';
      const defaultPrice=product.variants[0]?.price||product.price;
      const ownerField=product.personalised?`<label class="dc-order-form__full">OWNER MARK — обязательная индивидуальная гравировка<input name="ownerMark" maxlength="32" required placeholder="Имя, инициалы, дата, слово или личный код"><small>Маркировка становится постоянной частью конкретного объекта. Проверьте написание до подтверждения.</small></label>`:'';
      const personalisationNotice=product.personalised?`<label class="dc-order-form__full"><span><input type="checkbox" name="personalisedAck" required> Подтверждаю выбранный мной OWNER MARK и понимаю, что объект будет индивидуально изготовлен/завершён по моей спецификации. Для такого персонализированного товара обычное 14-дневное право отказа может не применяться согласно art. 38 ust. 1 pkt 3 Ustawy o prawach konsumenta. Права при дефекте или несоответствии сохраняются.</span></label>`:'';
      shell.innerHTML=`<section class="dc-order-form"><div class="dc-order-form__head"><span>PREORDER / FORM</span><div><h2>СНАЧАЛА<br>ЗАФИКСИРУЕМ.</h2><p>Оставьте данные для ручного подтверждения. Для OBJECT 001 сначала фиксируется ваша индивидуальная маркировка. BLIK показывается на следующем шаге.</p></div></div><div class="dc-order-form__grid"><form class="dc-order-form__fields" novalidate>${product.variants.length?`<label>Variant<select name="variant">${product.variants.map(v=>`<option value="${esc(v.label)}" data-price="${v.price}">${esc(v.label)} — €${v.price}</option>`).join('')}</select></label>`:''}${product.hasSizes?`<fieldset><legend>Size</legend><div class="dc-order-sizes">${sizes.map(s=>`<button type="button" data-size="${s}" class="${s==='M'?'is-active':''}">${s}</button>`).join('')}</div></fieldset>`:''}${ownerField}<label>Имя<input name="name" autocomplete="name" maxlength="120" required placeholder="Как к вам обращаться"></label><label>Email или Telegram<input name="contact" maxlength="200" required placeholder="@telegram или email"></label><label>Страна доставки<select name="country"><option>Poland</option><option>Germany</option><option>Czech Republic</option><option>Lithuania</option><option>Latvia</option><option>Estonia</option><option>France</option><option>Spain</option><option>Italy</option><option>Netherlands</option><option>Other EU</option></select></label><label>Город<input name="city" maxlength="120" required placeholder="Warsaw"></label><label class="dc-order-form__full">Комментарий — необязательно<textarea name="note" maxlength="1000" placeholder="Вопрос по размеру, подарок, удобный канал связи"></textarea></label>${personalisationNotice}<label class="dc-order-form__full"><span><input type="checkbox" name="termsAck" required> Я ознакомился с <a href="/legal/terms/" target="_blank" rel="noopener">Terms</a> и <a href="/legal/privacy/" target="_blank" rel="noopener">Privacy</a>.</span></label><button type="submit" class="dc-order-submit"><span>ПОДТВЕРДИТЬ ЗАКАЗ И ПЕРЕЙТИ К BLIK</span><span>→</span></button><p class="dc-order-form__legal">Следующий шаг содержит данные для оплаты. Заказ считается оплаченным после поступления BLIK и ручной сверки.</p></form><aside class="dc-order-summary" aria-live="polite"><span class="dc-order-summary__label">ORDER PREVIEW</span><h3>${esc(product.title)}</h3><div><span>SKU</span><strong>${esc(product.sku)}</strong></div>${product.variants.length?`<div><span>Variant</span><strong data-summary-variant>${esc(defaultVariant)}</strong></div>`:''}${product.hasSizes?'<div><span>Size</span><strong data-summary-size>M</strong></div>':''}${product.personalised?'<div><span>OWNER MARK</span><strong data-summary-owner>—</strong></div>':''}<div><span>State</span><strong>PREORDER</strong></div><div class="dc-order-summary__total"><span>TOTAL</span><strong data-summary-price>€${defaultPrice}</strong></div><div class="dc-order-payment" hidden><span>PREORDER / PAYMENT</span><strong>BLIK → +48 573 265 211</strong><p>Укажите в сообщении к переводу:</p><code data-payment-ref></code><p>После поступления платежа заказ подтверждается вручную по указанному контакту.</p></div></aside></div></section>`;
      const form=shell.querySelector('form');
      const payment=shell.querySelector('.dc-order-payment');
      let size='M';
      shell.querySelectorAll('[data-size]').forEach(btn=>btn.addEventListener('click',()=>{shell.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');size=btn.dataset.size;shell.querySelector('[data-summary-size]').textContent=size;payment.hidden=true;}));
      const variant=form.elements.variant;
      if(variant)variant.addEventListener('change',()=>{const opt=variant.selectedOptions[0];shell.querySelector('[data-summary-variant]').textContent=variant.value;shell.querySelector('[data-summary-price]').textContent=`€${opt.dataset.price}`;payment.hidden=true;});
      const owner=form.elements.ownerMark;
      if(owner)owner.addEventListener('input',()=>{shell.querySelector('[data-summary-owner]').textContent=owner.value.trim()||'—';payment.hidden=true;});
      form.addEventListener('submit',e=>{
        e.preventDefault();
        if(!form.checkValidity()){form.reportValidity();return;}
        const name=form.elements.name.value.trim(),contact=form.elements.contact.value.trim(),city=form.elements.city.value.trim();
        const ownerMark=owner?owner.value.trim():'';
        if(!name||!contact||!city||(product.personalised&&!ownerMark)){form.reportValidity();return;}
        const variantValue=variant?variant.value:'';
        const orderRef=refId();
        shell.querySelector('[data-payment-ref]').textContent=[product.sku,variantValue,product.hasSizes?size:'',ownerMark?`OWNER:${ownerMark}`:'',orderRef].filter(Boolean).join(' / ');
        try{localStorage.setItem(`dementorPreorder:${orderRef}`,JSON.stringify({sku:product.sku,title:product.title,variant:variantValue,size:product.hasSizes?size:null,ownerMark:ownerMark||null,name,contact,country:form.elements.country.value,city,termsAccepted:true,personalisedAccepted:product.personalised?true:null,createdAt:new Date().toISOString(),termsVersion:'0.2-2026-08-28'}));}catch(_e){}
        payment.hidden=false;
        payment.scrollIntoView({behavior:'smooth',block:'nearest'});
      });
    };

    mount.querySelector('[data-open-preorder]').addEventListener('click',()=>{announcePreorder();renderOrder(pageProduct);preorder.classList.add('is-open');lock();});
    const objectButton=mount.querySelector('[data-open-object]');if(objectButton&&objectModal)objectButton.addEventListener('click',()=>{objectModal.classList.add('is-open');lock();});
    [preorder,objectModal].filter(Boolean).forEach(modal=>modal.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',closeAll)));
  });

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});
})();