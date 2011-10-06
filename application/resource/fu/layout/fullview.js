goog.provide('fu.layout.FullView');

goog.require('fu.layout.Absolute');
goog.require('fu.dom.ViewportSizeMonitor');
goog.require('fu.events.EventType');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.layout.Stack');


/**
 * @constructor
 * @extends {fu.layout.Absolute}
 */
fu.layout.FullView = function() {
  goog.base(this);

  /**
   * @private
   * @type {fu.layout.FullView}
   */
  this._parentFullView = null;
};
goog.inherits(fu.layout.FullView, fu.layout.Absolute);

/**
 * @inheritDoc
 */
fu.layout.FullView.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.FullView.element(payload);
};

/**
 * @inheritDoc
 */
fu.layout.FullView.prototype.captureEvents = function() {
  goog.base(this, 'captureEvents');
  this._parentFullView = this._getParentFullView();

  if (this._parentFullView) {
    this.getHandler().listen(
      this._parentFullView,
      fu.events.EventType.LAYOUT_RESIZE,
      this._onResize,
      true);
  } else {
    this.getHandler().listen(
      fu.dom.ViewportSizeMonitor.getInstance(),
      fu.events.EventType.VIEWPORT_SIZE_CHANGE,
      this._onResize,
      true);
  }
};


/**
 * @inheritDoc
 */
fu.layout.FullView.prototype.refresh = function() {
  goog.base(this, 'refresh');
  var size;
  if (this._parentFullView) {
    var layoutNode = this.getElement().parentNode;
    while (layoutNode) {
      size = goog.style.getSize(/** @type {Element} */ (layoutNode));
      if (size.width && size.height) {
        break;
      } else {
        size = null;
        layoutNode = layoutNode.parentNode;
      }
    }
  }

  if (!size) {
    size = fu.dom.ViewportSizeMonitor.getInstance().getSize();
  }

  var oldSize = this.getSize();
  if (!goog.math.Size.equals(oldSize, size)) {
    this.setSize(size);
    this.dispatchEvent(fu.events.EventType.LAYOUT_RESIZE);
  }
};


/**
 * @param {Event} evt
 * @private
 */
fu.layout.FullView.prototype._onResize = function(evt) {
  if (evt.target == this) {
    return;
  }
  this.refresh();
};


/**
 * @return {fu.layout.FullView}
 */
fu.layout.FullView.prototype._getParentFullView = function() {
  var layoutParent = this.getParent();
  while (layoutParent) {
    if (layoutParent instanceof fu.layout.FullView) {
      return layoutParent;
    }
    layoutParent = layoutParent.getParent();
  }
  return null;
};