/*
 * Dementor Club workspace navigation listener guard.
 *
 * The Workspace shell is persistent while #appView is re-rendered. The legacy
 * controller bind() pass scans document-level [data-route] nodes after every
 * render, which can otherwise stack click handlers on persistent sidebar links.
 *
 * Sidebar links are also anchors for copyable/deep-linkable hash URLs. The
 * Workspace controller owns the actual view transition, so the browser default
 * anchor navigation must not race the controller and reset the rendered state.
 */
(() => {
  const nativeAdd = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (
      type === 'click' &&
      this instanceof Element &&
      this.matches('.dcw-nav [data-route]')
    ) {
      if (this.dataset.dcwNavClickBound === '1') return;
      this.dataset.dcwNavClickBound = '1';
    }

    return nativeAdd.call(this, type, listener, options);
  };

  document.addEventListener('click', event => {
    const link=event.target.closest?.('.dcw-nav a[data-route]');
    if(!link)return;
    event.preventDefault();
    const route=link.dataset.route;
    if(route&&location.pathname.replace(/^\/degradation_club/,'').startsWith('/workspace/')){
      history.replaceState(null,'',`${location.pathname}#${route}`);
    }
  }, {capture:true});
})();
