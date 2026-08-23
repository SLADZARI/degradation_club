(()=>{
  const cfg=window.DEMENTOR_SITE_CONFIG||{};
  const origin=cfg.canonicalOrigin;
  if(!origin)return;
  let canonical;
  try{canonical=new URL(location.pathname,origin).href;}catch{return;}

  let link=document.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}
  link.href=canonical;

  let og=document.querySelector('meta[property="og:url"]');
  if(!og){og=document.createElement('meta');og.setAttribute('property','og:url');document.head.appendChild(og);}
  og.setAttribute('content',canonical);
})();
