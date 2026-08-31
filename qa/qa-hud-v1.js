(() => {
  'use strict';

  const routeMap = [
    [/^\/$/, 'HOME'],
    [/^\/about\/?$/, 'ABOUT'],
    [/^\/events\/?/, 'EVENTS'],
    [/^\/projects\/?/, 'PROJECTS'],
    [/^\/community\/?/, 'COMMUNITY'],
    [/^\/merch\/?/, 'MERCH'],
    [/^\/join\/?/, 'JOIN'],
    [/^\/profile\/?/, 'PROFILE'],
    [/^\/workspace\/?/, 'WORKSPACE'],
    [/^\/auth\/?/, 'AUTH'],
    [/^\/catalog\/?/, 'CATALOG'],
    [/^\/courses?\/?/, 'COURSE'],
  ];

  const normalizeRoute = () => window.location.pathname || '/';
  const route = normalizeRoute();
  const defaultSurface = (routeMap.find(([pattern]) => pattern.test(route)) || [null, 'UNKNOWN'])[1];

  const state = {
    surface: document.body?.dataset?.qaSurface || defaultSurface,
    block: document.body?.dataset?.qaBlock || 'PAGE',
    appState: document.body?.dataset?.qaState || 'UNKNOWN',
    selected: null,
    inspector: false,
  };

  const style = document.createElement('style');
  style.textContent = `
    #dc-qa-hud{position:fixed;z-index:2147483647;right:10px;bottom:10px;width:min(360px,calc(100vw - 20px));font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:rgba(18,18,18,.94);color:#f5f1e8;border:1px solid rgba(245,241,232,.28);border-radius:10px;box-shadow:0 10px 35px rgba(0,0,0,.35);backdrop-filter:blur(8px)}
    #dc-qa-hud *{box-sizing:border-box}#dc-qa-hud button{font:inherit;color:inherit;background:#2a2a2a;border:1px solid rgba(245,241,232,.24);border-radius:6px;padding:7px 8px;cursor:pointer}#dc-qa-hud button:hover{background:#343434}
    #dc-qa-hud .qah{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid rgba(245,241,232,.16)}
    #dc-qa-hud .qab{padding:9px 10px}.qa-row{display:grid;grid-template-columns:72px 1fr;gap:8px;padding:2px 0}.qa-key{opacity:.58}.qa-value{overflow-wrap:anywhere}.qa-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.qa-id{font-weight:700;color:#d8ff4f}.qa-mini{opacity:.65}.dc-qa-selected{outline:2px solid #d8ff4f!important;outline-offset:2px!important}
    #dc-qa-hud[data-collapsed="true"] .qab{display:none}
  `;
  document.head.appendChild(style);

  const hud = document.createElement('aside');
  hud.id = 'dc-qa-hud';
  hud.setAttribute('aria-label', 'Dementor QA context');
  hud.innerHTML = `
    <div class="qah"><span><strong>DEMENTOR QA</strong> <span class="qa-mini">v1</span></span><button type="button" data-action="collapse">−</button></div>
    <div class="qab">
      <div class="qa-row"><span class="qa-key">Route</span><span class="qa-value" data-field="route"></span></div>
      <div class="qa-row"><span class="qa-key">Surface</span><span class="qa-value" data-field="surface"></span></div>
      <div class="qa-row"><span class="qa-key">Block</span><span class="qa-value qa-id" data-field="block"></span></div>
      <div class="qa-row"><span class="qa-key">State</span><span class="qa-value" data-field="state"></span></div>
      <div class="qa-row"><span class="qa-key">Viewport</span><span class="qa-value" data-field="viewport"></span></div>
      <div class="qa-row"><span class="qa-key">Build</span><span class="qa-value" data-field="build">loading…</span></div>
      <div class="qa-actions">
        <button type="button" data-action="inspect">Inspect block</button>
        <button type="button" data-action="copy">Copy QA context</button>
      </div>
    </div>`;
  document.body.appendChild(hud);

  const field = (name) => hud.querySelector(`[data-field="${name}"]`);
  const blockNameFor = (el) => {
    if (!el || el === document.body || el === document.documentElement) return 'PAGE';
    const explicit = el.closest('[data-qa-block]');
    if (explicit) return explicit.getAttribute('data-qa-block');
    const withId = el.closest('[id]');
    if (withId?.id && withId.id !== 'dc-qa-hud') return `#${withId.id}`;
    const semantic = el.closest('main,section,article,nav,header,footer,form,dialog');
    if (semantic) {
      const cls = [...semantic.classList].find((c) => c && !c.startsWith('js-'));
      return cls ? `${semantic.tagName.toLowerCase()}.${cls}` : semantic.tagName.toLowerCase();
    }
    return el.tagName ? el.tagName.toLowerCase() : 'UNKNOWN';
  };

  const render = () => {
    field('route').textContent = route;
    field('surface').textContent = state.surface;
    field('block').textContent = state.block;
    field('state').textContent = state.appState;
    field('viewport').textContent = `${window.innerWidth}×${window.innerHeight}`;
  };

  const context = () => ({
    qa: 'DEMENTOR_CLUB',
    route,
    surface: state.surface,
    block: state.block,
    appState: state.appState,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    build: field('build').textContent,
    url: window.location.href,
  });

  fetch('/QA_BUILD.txt', { cache: 'no-store' })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error('missing'))))
    .then((text) => { field('build').textContent = text.trim().replace(/\n/g, ' · '); })
    .catch(() => { field('build').textContent = 'local/unknown'; });

  hud.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'collapse') {
      const collapsed = hud.dataset.collapsed === 'true';
      hud.dataset.collapsed = collapsed ? 'false' : 'true';
      button.textContent = collapsed ? '−' : '+';
    }
    if (action === 'inspect') {
      state.inspector = !state.inspector;
      button.textContent = state.inspector ? 'Click a block…' : 'Inspect block';
    }
    if (action === 'copy') {
      const payload = JSON.stringify(context(), null, 2);
      try { await navigator.clipboard.writeText(payload); button.textContent = 'Copied'; }
      catch { window.prompt('Copy QA context', payload); }
      setTimeout(() => { button.textContent = 'Copy QA context'; }, 1200);
    }
  });

  document.addEventListener('click', (event) => {
    if (!state.inspector || hud.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    state.selected?.classList?.remove('dc-qa-selected');
    state.selected = event.target;
    state.selected.classList?.add('dc-qa-selected');
    state.block = blockNameFor(event.target);
    state.inspector = false;
    hud.querySelector('[data-action="inspect"]').textContent = 'Inspect block';
    render();
  }, true);

  window.addEventListener('resize', render, { passive: true });
  window.DementorQA = {
    setState(next) { state.appState = next || 'UNKNOWN'; render(); },
    setSurface(next) { state.surface = next || defaultSurface; render(); },
    setBlock(next) { state.block = next || 'PAGE'; render(); },
    context,
  };
  render();
})();
