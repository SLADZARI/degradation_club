// Bridges the approved preorder UI to the local-first cart without changing payment semantics.
(()=>{
  const boot=()=>{
    if(!window.DEMENTOR_CART)return setTimeout(boot,80);
    const mount=document.querySelector('[data-dc-preorder-form]');
    if(!mount)return;
    const sku=mount.dataset.sku||'SKU',title=mount.dataset.title||sku,basePrice=Number(mount.dataset.price||0);
    const variants=(mount.dataset.variants||'').split('|').filter(Boolean).map(row=>{const [label,p]=row.split(':');return{label,price:Number(p||basePrice)}});
    const observer=new MutationObserver(()=>{
      document.querySelectorAll('.dc-order-form').forEach(formShell=>{
        if(formShell.dataset.cartBridge==='1')return;formShell.dataset.cartBridge='1';
        const form=formShell.querySelector('form');if(!form)return;
        const submit=form.querySelector('.dc-order-submit');if(!submit)return;
        const add=document.createElement('button');add.type='button';add.className='dc-order-submit';add.style.marginTop='8px';add.innerHTML='<span>ДОБАВИТЬ В КОРЗИНУ</span><span>+</span>';submit.before(add);
        add.addEventListener('click',()=>{
          const variant=form.elements.variant?.value||'';
          const variantSpec=variants.find(v=>v.label===variant);
          const active=formShell.querySelector('[data-size].is-active');
          const size=active?.dataset.size||'';
          const item={productId:sku,sku,title,variantId:variant||null,variantLabel:variant||null,size:size||null,unitPriceEur:variantSpec?.price||basePrice,quantity:1,metadata:{source:location.pathname}};
          window.DEMENTOR_CART.add(item);
          add.querySelector('span').textContent='В КОРЗИНЕ';setTimeout(()=>add.querySelector('span').textContent='ДОБАВИТЬ В КОРЗИНУ',1200);
        });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
  };
  boot();
})();