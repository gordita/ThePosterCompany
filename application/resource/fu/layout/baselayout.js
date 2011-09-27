goog.provide('fu.layout.BaseLayout');

goog.require('fu.ui.BaseUI');
goog.require('goog.math.Size');


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.layout.BaseLayout = function() {
  goog.base(this);
};
goog.inherits(fu.layout.BaseLayout, fu.ui.BaseUI);

/**
 * @type {goog.math.Size}
 * @private
 */
fu.layout.BaseLayout.prototype._size = null;

/**
 * @param {goog.math.Size} size
 */
fu.layout.BaseLayout.prototype.setSize = function(size) {
  if (!goog.math.Size.equals(this._size, size)) {
    this._size = size;
    this.setSizeInternal(size);
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

