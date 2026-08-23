(()=>{
  const cfg=window.DEMENTOR_SITE_CONFIG||{};
  const status=(el,text,state='pending')=>{if(!el)return;el.textContent=text;el.dataset.state=state;};

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
        if(submit)submit.disabled=true;status(out,'Отправляем…','working');
        try{
          const body=Object.fromEntries(new FormData(contact).entries());
          const r=await fetch(cfg.contacts.endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
          if(!r.ok)throw new Error('request failed');
          contact.reset();status(out,'Сообщение отправлено.','success');
        }catch(err){status(out,'Не удалось отправить. Попробуйте позже.','error');}
        finally{if(submit)submit.disabled=false;}
      });
    }
  }

  document.querySelectorAll('[data-dc-donate-action]').forEach(a=>{
    if(!cfg.donate?.enabled||!cfg.donate?.checkoutUrl){
      a.setAttribute('aria-disabled','true');a.removeAttribute('href');a.classList.add('is-disabled');
      a.textContent='Платёжный канал готовится';
    }else a.href=cfg.donate.checkoutUrl;
  });

  document.querySelectorAll('[data-dc-checkout-action]').forEach(a=>{
    if(!cfg.merch?.checkoutEnabled||!cfg.merch?.checkoutUrl){
      a.setAttribute('aria-disabled','true');a.removeAttribute('href');a.classList.add('is-disabled');
    }else a.href=cfg.merch.checkoutUrl;
  });
})();
