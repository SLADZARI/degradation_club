/*
 * Dementor Club Workspace navigation listener guard.
 *
 * The Workspace shell is persistent while #appView is re-rendered. The legacy
 * controller bind() pass scans document-level [data-route] nodes after every
 * render, which can otherwise stack click handlers on persistent sidebar
 * controls. Root route URL state is owned by workspace-shell-v1.js; this guard
 * only prevents duplicate controller listeners.
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
})();
