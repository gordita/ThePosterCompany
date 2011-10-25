goog.provide('fu.app.fastweb.TopBar');

goog.require('fu.app.fastweb.PubSub');
goog.require('fu.app.fastweb.PubSub.Topic');
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

  /**
   * @type {boolean}
   * @private
   */
  this._menuOpened = false;
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
    this.getInnerElement('menu'),
    fu.events.EventType.TOUCHSTART,
    this._onTouchStart,
    true);
};

/**
 * @param {Event} evt
 * @private
 */
fu.app.fastweb.TopBar.prototype._onTouchStart = function(evt) {
  var target = evt.target;
  if (target.href) {
    switch (target) {
      case this.getInnerElement('menu'):
        this._menuOpened = !this._menuOpened;
        fu.app.fastweb.PubSub.publish(
          fu.app.fastweb.PubSub.Topic.MAIN_MENU_TOGGLE,
          this._menuOpened);
        break;
    }
  }
};