goog.provide('fu.app.fastweb.MainView');

goog.require('fu.app.fastweb.HomePage');
goog.require('fu.app.fastweb.TopBar');
goog.require('fu.layout.Layers');
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

  var layers = new fu.layout.Layers();
  this.addToBody(layers);

  var homepage = new fu.app.fastweb.HomePage();
  layers.addLayerContent(homepage);
};
goog.inherits(fu.app.fastweb.MainView, fu.layout.Stack);


