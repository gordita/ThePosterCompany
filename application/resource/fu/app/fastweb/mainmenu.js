goog.provide('fu.app.fastweb.MainMenu');

goog.require('fu.ui.BaseAsyncUI');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.MainMenu');

/**
 * @extends {fu.ui.BaseAsyncUI}
 * @constructor
 */
fu.app.fastweb.MainMenu = function() {
  goog.base(this);
};
goog.inherits(fu.app.fastweb.MainMenu, fu.ui.BaseAsyncUI);

/** @inheritDoc */
fu.app.fastweb.MainMenu.prototype.createTemplate = function(payload) {
  return tpl.fu.app.fastweb.MainMenu.element(payload);
};