(()=>{
  if(typeof document==='undefined')return;
  if(document.documentElement.dataset.dcSupport==='1')return;
  document.documentElement.dataset.dcSupport='1';

  const STORAGE='dc_support_session_v1';
  const state=(()=>{try{return JSON.parse(sessionStorage.getItem(STORAGE)||'{}')}catch{return{}}})();
  state.active=Number(state.active||0);state.first=!!state.first;state.second=!!state.second;state.suppressed=!!state.suppressed;
  const save=()=>{try{sessionStorage.setItem(STORAGE,JSON.stringify(state))}catch{}};

  if(!document.querySelector('link[href="/support-v1.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/support-v1.css';document.head.appendChild(l)}

  const modal=document.createElement('div');
  modal.className='dc-support-modal';modal.id='dc-support-modal';modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<div class="dc-support-panel" role="dialog" aria-modal="true" aria-labelledby="dc-support-title"><button class="dc-support-close" type="button">✕ CLOSE</button><section class="dc-support-hero"><div class="dc-support-kicker">SUPPORT DEMENTOR CLUB</div><h2 id="dc-support-title">ПОДДЕРЖАТЬ<br><span class="dc-support-acid">ДЕГРАДАЦИЮ.</span></h2><p>Добровольная поддержка развития клуба.</p><p>Вы ничего не покупаете и не получаете встречного обязательства.</p><p>Средства используются на производство материалов, события, исследования, инфраструктуру, деградацию клуба и менторов.</p></section><div class="dc-support-grid"><section class="dc-support-main"><div class="dc-support-kicker">SUPPORT / AMOUNT</div><h3>СКОЛЬКО<br>НЕ ЖАЛКО.</h3><div class="dc-support-amounts"><button type="button">€10</button><button type="button" class="is-active">€25</button><button type="button">€50</button><button type="button">€100</button><button type="button">€250</button></div><div class="dc-support-custom"><input type="number" min="1" step="1" placeholder="Своя сумма" aria-label="Своя сумма"><strong>EUR</strong></div><button class="dc-support-primary" type="button"><span>ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ</span><span>→</span></button><div class="dc-support-channels"><div class="dc-support-channel"><div><h4>BLIK</h4><p>Быстрый способ поддержки из Польши.</p></div><button type="button" data-support-channel="blik">ВЫБРАТЬ BLIK</button></div><div class="dc-support-detail" data-support-detail="blik"><span class="dc-support-kicker">SUPPORT / BLIK</span><b>+48 573 265 211</b><p>Сообщение к переводу:</p><code>SUPPORT DEMENTOR CLUB</code><p>Сумма: <strong data-support-amount>€25</strong></p></div><div class="dc-support-channel"><div><h4>CRYPTO</h4><p>Дополнительный канал. Публичный адрес пока не опубликован.</p></div><button type="button" data-support-channel="crypto">CRYPTO</button></div><div class="dc-support-detail" data-support-detail="crypto"><span class="dc-support-kicker">SUPPORT / CRYPTO</span><b>TRUST WALLET</b><p>Сеть и публичный адрес должны быть утверждены отдельно.</p><code>WALLET ADDRESS / MISSING</code></div></div></section><aside class="dc-support-side"><div class="dc-support-kicker">LEGAL / SUPPORT STATE</div><h3>НИЧЕГО<br>ВЗАМЕН.</h3><div class="dc-support-side-row"><span>Type</span><strong>VOLUNTARY SUPPORT</strong></div><div class="dc-support-side-row"><span>Goods</span><strong>NONE</strong></div><div class="dc-support-side-row"><span>Services</span><strong>NONE</strong></div><div class="dc-support-side-row"><span>Ownership</span><strong>NONE</strong></div><div class="dc-support-side-row"><span>Financial return</span><strong>NONE</strong></div><div class="dc-support-side-row"><span>Spory</span><strong>NOT ISSUED FOR SUPPORT</strong></div><div class="dc-support-legal">Voluntary support. No goods, services, ownership rights or financial return are provided in exchange.</div></aside></div></div>`;
  document.body.appendChild(modal);

  const prompt=document.createElement('div');prompt.className='dc-support-prompt';prompt.setAttribute('aria-live','polite');document.body.appendChild(prompt);
  let amount=25;
  const syncAmount=()=>modal.querySelectorAll('[data-support-amount]').forEach(el=>el.textContent=`€${amount}`);
  const suppress=()=>{state.suppressed=true;prompt.classList.remove('is-open');save()};
  const openModal=()=>{prompt.classList.remove('is-open');modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
  const closeModal=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};
  modal.querySelector('.dc-support-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal()});
  modal.querySelectorAll('.dc-support-amounts button').forEach(btn=>btn.addEventListener('click',()=>{modal.querySelectorAll('.dc-support-amounts button').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');amount=Number(btn.textContent.replace('€',''));modal.querySelector('.dc-support-custom input').value='';syncAmount()}));
  modal.querySelector('.dc-support-custom input').addEventListener('input',e=>{const v=Number(e.target.value);if(v>0){amount=v;modal.querySelectorAll('.dc-support-amounts button').forEach(x=>x.classList.remove('is-active'));syncAmount()}});
  modal.querySelector('.dc-support-primary').addEventListener('click',()=>modal.querySelector('.dc-support-channels').classList.toggle('is-open'));
  modal.querySelectorAll('[data-support-channel]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.supportChannel;modal.querySelectorAll('[data-support-detail]').forEach(x=>x.classList.toggle('is-open',x.dataset.supportDetail===key));if(key==='blik')suppress()}));

  const footer=document.querySelector('.dc-footer, footer');
  if(footer&&!footer.querySelector('.dc-support-footer-slot')){const slot=document.createElement('div');slot.className='dc-support-footer-slot';slot.innerHTML='<button type="button" class="dc-support-link">SUPPORT / ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ</button>';footer.appendChild(slot);slot.querySelector('button').addEventListener('click',openModal)}

  const makeFirst=()=>{prompt.innerHTML='<div class="dc-support-prompt__mini"><strong>ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ →</strong><div><button type="button" data-go>SUPPORT</button> <button type="button" class="dc-support-prompt__dismiss" data-dismiss>×</button></div></div>';prompt.classList.add('is-open');prompt.querySelector('[data-go]').addEventListener('click',openModal);prompt.querySelector('[data-dismiss]').addEventListener('click',()=>prompt.classList.remove('is-open'))};
  const makeSecond=()=>{prompt.innerHTML='<div class="dc-support-prompt__strong"><div class="dc-support-kicker">SUPPORT / 04:00</div><h3>ВЫ УЖЕ 4 МИНУТЫ ЗДЕСЬ.<br>МОЖНО ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ.</h3><div class="dc-support-prompt__actions"><button type="button" data-go>ПОДДЕРЖАТЬ</button><button type="button" class="is-no" data-no>НЕ НАДО</button></div></div>';prompt.classList.add('is-open');prompt.querySelector('[data-go]').addEventListener('click',openModal);prompt.querySelector('[data-no]').addEventListener('click',suppress)};

  document.addEventListener('click',e=>{if(e.target.closest('[data-dc-preorder-open],.dc-merch-cta--primary,.dc-commerce-action--primary,.object-preorder,.dc-order-submit,[data-open-preorder],[data-object-preorder]'))suppress()});
  document.addEventListener('dc:preorder-open',suppress);

  setInterval(()=>{if(state.suppressed)return;if(document.visibilityState==='visible'&&document.hasFocus()){state.active+=1;if(!state.first&&state.active>=60){state.first=true;makeFirst()}if(!state.second&&state.active>=240){state.second=true;makeSecond()}save()}},1000);
  syncAmount();
})();