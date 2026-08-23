(()=>{
  const cfg=window.DEMENTOR_SITE_CONFIG||{};
  const status=(el,text,state='pending')=>{if(!el)return;el.textContent=text;el.dataset.state=state;};
  const disableLink=(a,text)=>{a.setAttribute('aria-disabled','true');a.removeAttribute('href');a.classList.add('is-disabled');if(text)a.textContent=text;};

  const contact=document.querySelector('[data-dc-contact-form]');
  if(contact){
    const submit=contact.querySelector('[type="submit"]');
    const out=document.querySelector('[data-dc-contact-status]');
    if(!cfg.contacts?.enabled||!cfg.contacts?.endpoint){
      if(submit){submit.disabled=true;submit.setAttribute('aria-disabled','true');}
      status(out,'Отправка появится после утверждения официального канала.','pending');
    }else{
      contact.addEventListener('submit',async e=>{
        e.preventDefault();
        if(!contact.reportValidity())return;
        if(submit)submit.disabled=true;status(out,'Отправляем…','working');
        const controller=new AbortController();
        const timer=setTimeout(()=>controller.abort(),15000);
        try{
          const body=Object.fromEntries(new FormData(contact).entries());
          const r=await fetch(cfg.contacts.endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:controller.signal});
          if(!r.ok)throw new Error(`request failed: ${r.status}`);
          contact.reset();status(out,'Сообщение отправлено.','success');
        }catch(err){
          status(out,err?.name==='AbortError'?'Сервер не ответил вовремя. Попробуйте позже.':'Не удалось отправить. Попробуйте позже.','error');
        }finally{
          clearTimeout(timer);
          if(submit)submit.disabled=false;
        }
      });
    }
  }

  document.querySelectorAll('[data-dc-donate-action]').forEach(a=>{
    if(!cfg.donate?.enabled||!cfg.donate?.checkoutUrl)disableLink(a,'Платёжный канал готовится');
    else a.href=cfg.donate.checkoutUrl;
  });

  document.querySelectorAll('[data-dc-checkout-action]').forEach(a=>{
    if(!cfg.merch?.checkoutEnabled||!cfg.merch?.checkoutUrl)disableLink(a);
    else a.href=cfg.merch.checkoutUrl;
  });

  document.querySelectorAll('[data-dc-event-registration]').forEach(a=>{
    if(!cfg.events?.registrationEnabled||!cfg.events?.registrationUrl)disableLink(a,'Регистрация ещё не открыта');
    else a.href=cfg.events.registrationUrl;
  });

  document.querySelectorAll('[data-dc-membership-action]').forEach(a=>{
    if(!cfg.community?.membershipEnabled||!cfg.community?.membershipUrl)disableLink(a,'Механика членства формируется');
    else a.href=cfg.community.membershipUrl;
  });
})();
