(()=>{
  const money=value=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
  const node=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!=null)el.textContent=text;return el;};
  const pendingMedia=()=>{const wrap=node('div','dc-merch-media-pending');wrap.textContent='IMAGE PENDING / PRODUCT MEDIA IN PRODUCTION';return wrap;};
  const load=async url=>{const r=await fetch(url,{headers:{accept:'application/json'}});if(!r.ok)throw new Error(`Failed to load ${url}: ${r.status}`);return r.json();};

  const renderStore=async root=>{
    root.innerHTML='';
    root.append(node('div','dc-merch-loading','LOADING OBJECT REGISTER…'));
    try{
      const data=await load(root.dataset.storeRecord||'/content/merch/store.json');
      root.innerHTML='';
      const grid=node('div','dc-merch-store__grid');
      data.products.forEach(product=>{
        const a=node('a','dc-merch-card');a.href=product.publicUrl;
        const media=node('div','dc-merch-card__media');
        if(product.cover){const img=new Image();img.src=product.cover;img.alt=product.title;img.loading='lazy';media.append(img);}else media.append(pendingMedia());
        const body=node('div','dc-merch-card__body');
        const meta=node('div','dc-merch-card__meta');meta.append(node('span','',product.id),node('span','dc-merch-card__status',`${String(product.status).toUpperCase()} / SALE ${String(product.saleStatus).toUpperCase()}`));
        body.append(meta,node('div','dc-merch-card__title',product.title),node('div','dc-merch-card__price',`FROM ${money(product.fromPriceEur)}`));
        a.append(media,body);grid.append(a);
      });
      root.append(grid);
    }catch(err){root.innerHTML='';root.append(node('div','dc-merch-error','Не удалось загрузить реестр мерча.'));
      console.error(err);
    }
  };

  const specRow=(label,value)=>{const frag=document.createDocumentFragment();const dt=node('dt','',label);const dd=node('dd','',value);frag.append(dt,dd);return frag;};
  const dimensions=v=>Array.isArray(v.dimensionsMm)?`${v.dimensionsMm.join(' × ')} mm`:v.label||'—';
  const weight=v=>typeof v.weightKg==='number'?`~${v.weightKg} kg`:v.weightKg&&typeof v.weightKg==='object'?`${v.weightKg.min}–${v.weightKg.max} kg`:'—';

  const applyOffer=(a,variant)=>{
    const offer=variant.offer||{};
    a.dataset.saleStatus=offer.saleStatus||'closed';
    if(offer.purchaseUrl)a.dataset.checkoutUrl=offer.purchaseUrl;
    a.setAttribute('data-dc-checkout-action','');
    a.textContent=offer.saleStatus==='preorder'?'PREORDER →':'BUY →';
    if(window.DEMENTOR_SERVICES?.applyMerchCheckout)window.DEMENTOR_SERVICES.applyMerchCheckout(a);
    else if(!window.DEMENTOR_SITE_CONFIG?.merch?.checkoutEnabled||!offer.purchaseUrl||!['open','preorder'].includes(offer.saleStatus)){
      a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.classList.add('is-disabled');a.textContent='CHECKOUT CLOSED';
    }
  };

  const renderProduct=async root=>{
    root.innerHTML='';root.append(node('div','dc-merch-loading','LOADING OBJECT…'));
    try{
      const data=await load(root.dataset.productRecord);
      root.innerHTML='';
      document.title=`${data.title} — Dementor Club`;
      const layout=node('div','dc-merch-product__layout');
      const media=node('div','dc-merch-product__media');
      if(data.media?.length){const img=new Image();img.src=data.media[0].path;img.alt=data.media[0].alt||data.title;media.append(img);}else media.append(pendingMedia());

      const panel=node('div','dc-merch-product__panel');
      panel.append(node('div','dc-merch-product__id',`${data.id} / ${String(data.status).toUpperCase()} / SALE ${String(data.saleStatus).toUpperCase()}`));
      panel.append(node('h1','dc-merch-product__title',data.title));
      panel.append(node('div','dc-merch-product__statement',data.statement));
      if(data.shortLines?.length){const short=node('div','dc-merch-product__short');data.shortLines.forEach(line=>short.append(node('div','',line)));panel.append(short);}

      const specs=node('dl','dc-merch-specs');
      specs.append(specRow('Material',data.material||'—'));
      specs.append(specRow('Finish',data.finish||'—'));
      const edition=data.edition?.limit?`до ${data.edition.limit} / ${data.edition.type||''}`:(data.edition?.note||data.edition?.type||'—');
      specs.append(specRow('Edition',edition));
      panel.append(specs);

      const variants=data.variants||[];
      let selected=variants[0];
      let select=null;
      if(variants.length>1){
        const vbox=node('div','dc-merch-variant');
        const label=node('label','', 'Variant');label.htmlFor='merch-variant-select';
        select=node('select','');select.id='merch-variant-select';
        variants.forEach((v,i)=>{const option=node('option','',`${v.label} — ${money(v.basePriceEur)}`);option.value=String(i);select.append(option);});
        vbox.append(label,select);panel.append(vbox);
      }

      const dynamicSpecs=node('dl','dc-merch-specs');
      const dLabel=node('dt','','Dimensions'),dValue=node('dd','',dimensions(selected));
      const wLabel=node('dt','','Weight'),wValue=node('dd','',weight(selected));
      const sLabel=node('dt','','Stock'),sValue=node('dd','',String(selected.stockStatus||'unknown').toUpperCase());
      dynamicSpecs.append(dLabel,dValue,wLabel,wValue,sLabel,sValue);panel.append(dynamicSpecs);

      const price=node('div','dc-merch-price');const priceValue=node('strong','',money(selected.basePriceEur));price.append(priceValue,node('span','','CANONICAL PRICE / EUR'));panel.append(price);
      const buy=node('div','dc-merch-buy');const action=node('a','dc-action dc-action--acid');applyOffer(action,selected);buy.append(action,node('div','dc-merch-note','Прямой checkout без корзины. Кнопка откроется только после утверждения sale status и payment URL для выбранного SKU.'));panel.append(buy);

      if(select)select.addEventListener('change',()=>{
        selected=variants[Number(select.value)];
        dValue.textContent=dimensions(selected);wValue.textContent=weight(selected);sValue.textContent=String(selected.stockStatus||'unknown').toUpperCase();priceValue.textContent=money(selected.basePriceEur);
        action.removeAttribute('href');action.removeAttribute('data-checkout-url');action.classList.remove('is-disabled');action.removeAttribute('aria-disabled');applyOffer(action,selected);
      });

      layout.append(media,panel);root.append(layout);
    }catch(err){root.innerHTML='';root.append(node('div','dc-merch-error','Не удалось загрузить карточку объекта.'));console.error(err);}
  };

  document.querySelectorAll('[data-merch-index]').forEach(renderStore);
  document.querySelectorAll('[data-merch-product]').forEach(renderProduct);
})();
