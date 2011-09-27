goog.provide('fu.app.fastweb.MainView');

goog.require('fu.app.fastweb.TopBar');
goog.require('fu.layout.Stack');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.MenuView');


/**
 * @constructor
 * @extends {fu.layout.Stack}
 */
fu.app.fastweb.MainView = function() {
  goog.base(this);
  var topBar = new fu.app.fastweb.TopBar();
  this.addToHeader(topBar);
  this.addCssName(tpl.fu.CSSNames.CSS_MAIN_VIEW);
};
goog.inherits(fu.app.fastweb.MainView, fu.layout.Stack);


