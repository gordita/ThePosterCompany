goog.provide('fu.app.fastweb.NewsFeed');

goog.require('fbapi');
goog.require('fu.async.Callback');
goog.require('fu.ui.BaseAsyncUI');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.NewsFeed');


/**
 * @extends {fu.ui.BaseAsyncUI}
 * @constructor
 */
fu.app.fastweb.NewsFeed = function() {
  goog.base(this);
};
goog.inherits(fu.app.fastweb.NewsFeed, fu.ui.BaseAsyncUI);


/** @inheritDoc */
fu.app.fastweb.NewsFeed.prototype.getAsyncData = function() {
  return fbapi.query('home');
};

/** @inheritDoc */
fu.app.fastweb.NewsFeed.prototype.createAsyncTemplate = function(payload) {
  return tpl.fu.app.fastweb.NewsFeed.asyncElement(payload);
};