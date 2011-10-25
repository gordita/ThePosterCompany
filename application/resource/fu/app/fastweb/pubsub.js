goog.provide('fu.app.fastweb.PubSub');
goog.provide('fu.app.fastweb.PubSub.Topic');


goog.require('goog.pubsub.PubSub');

/**
 * @enum {string}
 */
fu.app.fastweb.PubSub.Topic = {
  MAIN_MENU_TOGGLE : 'MAIN_MENU_TOGGLE'
};


/**
 * @type {goog.pubsub.PubSub}
 * @private
 */
fu.app.fastweb.PubSub._instance = null;

/**
 *
 * @param {fu.app.fastweb.PubSub.Topic} topic
 * @param {Function} fn
 * @param {Object=} opt_context
 */
fu.app.fastweb.PubSub.subscribe = function(topic, fn, opt_context) {
  var pubsub = fu.app.fastweb.PubSub._getInstance();
  pubsub.subscribe.apply(pubsub, arguments);
};

/**
 *
 * @param {fu.app.fastweb.PubSub.Topic} topic
 * @param {Function} fn
 * @param {Object=} opt_context
 */
fu.app.fastweb.PubSub.subscribeOnce = function(topic, fn, opt_context) {
  var pubsub = fu.app.fastweb.PubSub._getInstance();
  pubsub.subscribeOnce.apply(pubsub, arguments);
};

/**
 *
 * @param {fu.app.fastweb.PubSub.Topic} topic
 * @param {Function} fn
 * @param {Object=} opt_context
 */
fu.app.fastweb.PubSub.unsubscribe = function(topic, fn, opt_context) {
  var pubsub = fu.app.fastweb.PubSub._getInstance();
  pubsub.unsubscribe.apply(pubsub, arguments);
};

/**
 * Publishes a message to a topic.  Calls functions subscribed to the topic in
 * the order in which they were added, passing all arguments along.  If any of
 * the functions throws an uncaught error, publishing is aborted.
 *
 * @param {string} topic Topic to publish to.
 * @param {...*} var_args Arguments that are applied to each subscription
 *     function.
 */
fu.app.fastweb.PubSub.publish = function(topic, var_args) {
  var pubsub = fu.app.fastweb.PubSub._getInstance();
  pubsub.publish.apply(pubsub, arguments);
};

/**
 * @private
 * @return {goog.pubsub.PubSub}
 */
fu.app.fastweb.PubSub._getInstance = function() {
  if (!fu.app.fastweb.PubSub._instance) {
    fu.app.fastweb.PubSub._instance = new goog.pubsub.PubSub();
  }
  return fu.app.fastweb.PubSub._instance;
};