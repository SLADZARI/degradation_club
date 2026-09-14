const YOUTUBE_ID=/^[A-Za-z0-9_-]{6,}$/;

export function youtubeVideoId(value){
  if(!value)return null;
  let url;try{url=new URL(String(value),location.origin)}catch{return null}
  const host=url.hostname.toLowerCase().replace(/^www\./,'');
  let id=null;
  if(host==='youtu.be')id=url.pathname.split('/').filter(Boolean)[0]||null;
  else if(host==='youtube.com'||host.endsWith('.youtube.com')){
    const parts=url.pathname.split('/').filter(Boolean);
    if(parts[0]==='shorts'||parts[0]==='embed')id=parts[1]||null;
    else if(parts[0]==='watch')id=url.searchParams.get('v');
  }
  return id&&YOUTUBE_ID.test(id)?id:null;
}

function ensureBadge(media,id){
  media.classList.add('dc-youtube-presentation');media.dataset.youtubeVideoId=id;
  if(!media.querySelector('[data-youtube-play]')){const play=document.createElement('span');play.dataset.youtubePlay='1';play.className='dc-youtube-presentation__play';play.setAttribute('aria-hidden','true');play.textContent='▶';media.appendChild(play)}
  if(!media.querySelector('[data-youtube-label]')){const label=document.createElement('span');label.dataset.youtubeLabel='1';label.className='dc-youtube-presentation__label';label.textContent='VIDEO · YOUTUBE';media.appendChild(label)}
}

function enhance(container,{linkSelector,mediaSelector,mediaClass}){
  const link=container.querySelector(linkSelector);const id=youtubeVideoId(link?.href);if(!id)return;
  let media=container.querySelector(mediaSelector);let image=media?.querySelector('img');
  if(!media||!image){media=document.createElement('div');media.className=`${mediaClass} dc-youtube-presentation`;image=document.createElement('img');image.src=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;image.alt='YouTube preview';image.loading='lazy';image.decoding='async';media.appendChild(image);const anchorBlock=link.closest('p')||link;anchorBlock.parentNode?.insertBefore(media,anchorBlock)}
  ensureBadge(media,id);
}

function apply(){
  document.querySelectorAll('.dc-notice[data-artifact]').forEach(card=>enhance(card,{linkSelector:'.dc-notice__link',mediaSelector:'.dc-notice__media',mediaClass:'dc-notice__media'}));
  document.querySelectorAll('.dc-artifact-record').forEach(record=>enhance(record,{linkSelector:'.dc-artifact-link',mediaSelector:'.dc-artifact-media',mediaClass:'dc-artifact-media'}));
}

let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
