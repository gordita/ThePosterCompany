goog.provide('fu.layout.BaseLayout');

goog.require('fu.ui.BaseUI');
goog.require('fu.events.EventType');
goog.require('goog.array');
goog.require('goog.math.Size');


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.layout.BaseLayout = function() {
  goog.base(this);
  /**
   * @type {goog.math.Size}
   * @private
   */
  this._size = new goog.math.Size(0, 0);

  /**
   * @type {boolean}
   * @private
   */
  this._resizeWithViewPort = false;
};
goog.inherits(fu.layout.BaseLayout, fu.ui.BaseUI);


/**
 * @param {goog.math.Size} size
 */
fu.layout.BaseLayout.prototype.setSize = function(size) {
  if (!goog.math.Size.equals(this._size, size)) {
    this._size = size;
    this.setSizeInternal(size);
    this.dispatchEvent(fu.events.EventType.LAYOUT_RESIZE);
  }
};


/**
 * @return {goog.math.Size}
 */
fu.layout.BaseLayout.prototype.getSize = function() {
  return this._size.clone();
};


/**
 * @param {goog.math.Size} size
 */
fu.layout.BaseLayout.prototype.setSizeInternal = function(size) {
  goog.style.setSize(this.getElement(), size);
};

