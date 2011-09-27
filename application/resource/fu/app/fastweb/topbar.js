goog.provide('fu.app.fastweb.TopBar');

goog.require('fu.events.EventType');
goog.require('fu.ui.BaseUI');
goog.require('goog.Uri');
goog.require('goog.events.EventType');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.TopBar');


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.app.fastweb.TopBar = function() {
  goog.base(this);
};
goog.inherits(fu.app.fastweb.TopBar, fu.ui.BaseUI);

/** @inheritDoc */
fu.app.fastweb.TopBar.prototype.createTemplate = function(payload) {
  return tpl.fu.app.fastweb.TopBar.element(payload);
};

/** @inheritDoc */
fu.app.fastweb.TopBar.prototype.captureEvents = function() {
  goog.base(this, 'captureEvents');
  this.getHandler().listen(
    this.getElement(),
    fu.events.EventType.TOUCHSTART,
    this._onTouchStart);
};

/**
 * @param {Event} evt
 * @private
 */
fu.app.fastweb.TopBar.prototype._onTouchStart = function(evt) {
  var target = evt.target;
  if (target.href) {
    var uri = new goog.Uri(target.href);
    if (uri.getParameterValue('open') != 'x') {
      uri.setParameterValue('open', 'x');
    } else {
      uri.setParameterValue('open', 'y');
    }
    target.href = uri.toString();
  }
};