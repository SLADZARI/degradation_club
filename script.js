// Dementor Club site runtime.
// The current onboarding copy/scoring base is pinned to the last approved V4 commit;
// this layer randomizes answer positions without changing their semantic scores.
(()=>{
  const BASE='https://cdn.jsdelivr.net/gh/SLADZARI/degradation_club@0c34e194b610d72f535fd5ea96c6cd6fbf0d58e8/script.js';
  const base=document.createElement('script');
  base.src=BASE;
  base.async=false;
  base.onload=()=>{
    if(!location.pathname.startsWith('/join'))return;
    const host=document.getElementById('questionHost');
    if(!host)return;

    const permutations=[
      [2,0,3,1],
      [1,3,0,2],
      [3,1,2,0],
      [0,2,1,3],
      [2,3,1,0],
      [1,0,3,2],
      [3,0,1,2],
      [0,3,2,1]
    ];

    function hash(str){
      let h=2166136261;
      for(let i=0;i<str.length;i++){
        h^=str.charCodeAt(i);
        h=Math.imul(h,16777619);
      }
      return h>>>0;
    }

    function shuffleVisibleAnswers(){
      const article=host.querySelector('.question');
      if(!article)return;
      const answers=article.querySelector('.answers');
      if(!answers)return;
      const buttons=[...answers.querySelectorAll('.answer')];
      if(buttons.length!==4)return;

      const sphere=new URLSearchParams(location.search).get('sphere')||'club';
      const counter=document.getElementById('counter')?.textContent||'1';
      const step=parseInt(counter,10)||1;
      const key=`${sphere}:${step}:v5`;
      if(answers.dataset.shuffleKey===key)return;

      const perm=permutations[hash(key)%permutations.length];
      const byScore=new Map(buttons.map(btn=>[Number(btn.dataset.i),btn]));
      perm.forEach(score=>{
        const btn=byScore.get(score);
        if(btn)answers.appendChild(btn);
      });

      [...answers.querySelectorAll('.answer')].forEach((btn,visualIndex)=>{
        const letter=btn.querySelector('b');
        if(letter)letter.textContent=String.fromCharCode(65+visualIndex);
      });
      answers.dataset.shuffleKey=key;
    }

    let scheduled=false;
    const schedule=()=>{
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{
        scheduled=false;
        shuffleVisibleAnswers();
      });
    };
    new MutationObserver(schedule).observe(host,{childList:true,subtree:true});
    schedule();
  };
  base.onerror=()=>console.error('Dementor Club onboarding base failed to load');
  document.head.appendChild(base);
})();
