goog.provide('fu.layout.Scroll');

goog.require('fu.layout.BaseLayout');
goog.require('fu.events.EventType');
goog.require('fu.ui.scroll.Scrollable');
goog.require('fu.ui.scroll.TouchScroller');
goog.require('goog.dispose');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.layout.Scroll');


/**
 * @constructor
 * @extends {fu.layout.BaseLayout}
 */
fu.layout.Scroll = function() {
  goog.base(this);

  /**
   * @type {fu.ui.scroll.Scrollable}
   * @private
   */
  this._scrollable = null;
};
goog.inherits(fu.layout.Scroll, fu.layout.BaseLayout);


/** @inheritDoc */
fu.layout.Scroll.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this._scrollable);
};


/** @inheritDoc */
fu.layout.Scroll.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.Scroll.element(payload);
};

/** @inheritDoc */
fu.layout.Scroll.prototype.getContentElement = function() {
  return this.getInnerElement('content');
};


/** @inheritDoc */
fu.layout.Scroll.prototype.captureEvents = function() {
  goog.base(this, 'captureEvents');
  if (!this._scrollable) {
    this._scrollable = new fu.ui.scroll.TouchScroller(this.getElement());
  } else {
    this._scrollable.setScrollable(true);
  }
};


/** @inheritDoc */
fu.layout.Scroll.prototype.releaseEvents = function() {
  goog.base(this, 'releaseEvents');
  if (this._scrollable) {
    this._scrollable.setScrollable(false);
  }
};