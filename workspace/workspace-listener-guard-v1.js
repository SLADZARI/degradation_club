/*
 * Dementor Club workspace navigation listener guard.
 *
 * The workspace shell is persistent while #appView is re-rendered. The legacy
 * bind() pass scans document-level [data-route] nodes after every render, which
 * can otherwise stack click handlers on the persistent sidebar navigation.
 * Dynamic route buttons inside #appView are replaced on render and are not
 * affected by this guard.
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
