(()=>{
  const mounts=[...document.querySelectorAll('[data-dc-preorder-form]')];
  if(!mounts.length)return;
  const sizes=['XXS','XS','S','M','L','XL','XXL','3XL'];
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const id=()=>`DC-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random()*90+10)}`;
  mounts.forEach((mount,index)=>{
    const sku=mount.dataset.sku||'SKU';
    const title=mount.dataset.title||sku;
    const price=Number(mount.dataset.price||0);
    const hasSizes=mount.dataset.sizes!=='false';
    const variants=(mount.dataset.variants||'').split('|').filter(Boolean).map(row=>{const [label,p]=row.split(':');return{label,price:Number(p||price)}});
    const defaultVariant=variants[0]?.label||'';
    mount.innerHTML=`<section class="dc-order-form" aria-labelledby="dc-order-title-${index}">
      <div class="dc-order-form__head"><span>PREORDER / FORM</span><h2 id="dc-order-title-${index}">СНАЧАЛА<br>ЗАФИКСИРУЕМ.</h2><p>Минимум данных для ручного подтверждения заказа. Оплата — BLIK после проверки выбранной позиции.</p></div>
      <div class="dc-order-form__grid">
        <form class="dc-order-form__fields" novalidate>
          ${variants.length?`<label>Variant<select name="variant">${variants.map(v=>`<option value="${esc(v.label)}" data-price="${v.price}">${esc(v.label)} — €${v.price}</option>`).join('')}</select></label>`:''}
          ${hasSizes?`<fieldset><legend>Size</legend><div class="dc-order-sizes">${sizes.map(s=>`<button type="button" data-size="${s}" class="${s==='M'?'is-active':''}">${s}</button>`).join('')}</div></fieldset>`:''}
          <label>Имя<input name="name" autocomplete="name" maxlength="120" required placeholder="Как к вам обращаться"></label>
          <label>Email или Telegram<input name="contact" maxlength="200" required placeholder="@telegram или email"></label>
          <label>Страна доставки<select name="country"><option>Poland</option><option>Germany</option><option>Czech Republic</option><option>Lithuania</option><option>Latvia</option><option>Estonia</option><option>France</option><option>Spain</option><option>Italy</option><option>Netherlands</option><option>Other EU</option></select></label>
          <label>Город<input name="city" maxlength="120" required placeholder="Warsaw"></label>
          <label class="dc-order-form__full">Комментарий — необязательно<textarea name="note" maxlength="1000" placeholder="Вопрос по размеру, подарок, удобный канал связи"></textarea></label>
          <button type="submit" class="dc-order-submit"><span>ПРОДОЛЖИТЬ К ОПЛАТЕ</span><span>→</span></button>
          <p class="dc-order-form__legal">Форма подготавливает данные preorder на этой странице. Заказ считается подтверждённым после поступления BLIK и ручной сверки.</p>
        </form>
        <aside class="dc-order-summary" aria-live="polite">
          <span class="dc-order-summary__label">ORDER PREVIEW</span><h3>${esc(title)}</h3>
          <div><span>SKU</span><strong>${esc(sku)}</strong></div>
          ${variants.length?`<div><span>Variant</span><strong data-summary-variant>${esc(defaultVariant)}</strong></div>`:''}
          ${hasSizes?`<div><span>Size</span><strong data-summary-size>M</strong></div>`:''}
          <div><span>State</span><strong>PREORDER</strong></div><div><span>Payment</span><strong>BLIK</strong></div><div><span>Shipping</span><strong>CONFIRMED MANUALLY</strong></div>
          <div class="dc-order-summary__total"><span>TOTAL</span><strong data-summary-price>€${variants[0]?.price||price}</strong></div>
          <div class="dc-order-payment" hidden><span>PREORDER / NEXT STEP</span><strong>BLIK → +48 573 265 211</strong><p>Укажите в сообщении к переводу:</p><code data-payment-ref></code><p>После поступления платежа заказ подтверждается вручную по указанному контакту.</p></div>
        </aside>
      </div>
    </section>`;
    const form=mount.querySelector('form');
    const payment=mount.querySelector('.dc-order-payment');
    let size='M';
    mount.querySelectorAll('[data-size]').forEach(btn=>btn.addEventListener('click',()=>{mount.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');size=btn.dataset.size;mount.querySelector('[data-summary-size]').textContent=size;payment.hidden=true;}));
    const variant=form.elements.variant;
    if(variant)variant.addEventListener('change',()=>{const opt=variant.selectedOptions[0];mount.querySelector('[data-summary-variant]').textContent=variant.value;mount.querySelector('[data-summary-price]').textContent=`€${opt.dataset.price}`;payment.hidden=true;});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=form.elements.name.value.trim(),contact=form.elements.contact.value.trim(),city=form.elements.city.value.trim();
      if(!name||!contact||!city){form.reportValidity();return;}
      const variantValue=variant?variant.value:'';
      const ref=[sku,variantValue,hasSizes?size:'',id()].filter(Boolean).join(' / ');
      mount.querySelector('[data-payment-ref]').textContent=ref;
      payment.hidden=false;
      payment.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });
})();