// QA compatibility shim: preserve current site runtime while Home markup is being aligned.
if(!document.querySelector('script[src="/motion-v1.js"]')){const s=document.createElement('script');s.src='/motion-v1.js';s.defer=true;document.head.appendChild(s);}
