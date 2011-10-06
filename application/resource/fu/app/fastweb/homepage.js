goog.provide('fu.app.fastweb.HomePage');

goog.require('fu.app.fastweb.NewsFeed');
goog.require('fu.layout.Scroll');
goog.require('fu.layout.Stack');


/**
 * @constructor
 * @extends {fu.layout.Stack}
 */
fu.app.fastweb.HomePage = function() {
  goog.base(this);

  var newsFeed = new fu.app.fastweb.NewsFeed();
  var scroll = new fu.layout.Scroll();
  scroll.addChild(newsFeed);

  this.addToBody(scroll);
};
goog.inherits(fu.app.fastweb.HomePage, fu.layout.Stack);