goog.provide('fu.layout.FullView');

goog.require('fu.layout.AbsoluteLayout');
goog.require('fu.dom.ViewportSizeMonitor');
goog.require('fu.events.EventType');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.layout.Stack');


/**
 * @constructor
 * @extends {fu.layout.AbsoluteLayout}
 */
fu.layout.FullView = function() {
  goog.base(this);
};
goog.inherits(fu.layout.FullView, fu.layout.AbsoluteLayout);

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
  this.getHandler().listen(
    fu.dom.ViewportSizeMonitor.getInstance(),
    fu.events.EventType.VIEWPORT_SIZE_CHANGE,
    this.refresh
  );
};


/**
 * @inheritDoc
 */
fu.layout.FullView.prototype.refresh = function() {
  goog.base(this, 'refresh');
  var size = fu.dom.ViewportSizeMonitor.getInstance().getSize();
  this.setSize(size);
};