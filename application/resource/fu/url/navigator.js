goog.provide('fu.url.Navigator');

goog.require('fu.env.runtime');
goog.require('fu.events.EventType');
goog.require('fu.url.Dispatcher');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');


/**
 * @param {Window} window
 * @extends {goog.events.EventTarget}
 * @constructor
 */
fu.url.Navigator = function(window) {
  goog.base(this);

  /**
   * @type {Window}
   * @private
   */
  this._window = window;
};
goog.inherits(fu.url.Navigator, goog.events.EventTarget);


/**
 * @param {string|goog.Uri} url
 */
fu.url.Navigator.prototype.go = function(url) {
  var targetUri = new goog.Uri(url);
  if (!targetUri.getDomain()) {
    // Relative path, fix it.
    targetUri = new goog.Uri(this._window.location.href);
    targetUri.setPath(url.toString());
  }
  var currentUri = fu.url.Dispatcher.resolve(this._window);
  // In-Site URL.
  if (targetUri.toString() == currentUri.toString()) {
    return;
  }

  if (targetUri.getDomain() == 'facebook.com' ||
    goog.string.endsWith(targetUri.getDomain(), '.facebook.com') ||
    targetUri.getDomain() == currentUri.getDomain()) {
    // In-Site URL.
    targetUri.setDomain(currentUri.getDomain());
    targetUri.setScheme(currentUri.getScheme());
    targetUri.setPort(currentUri.getPort());

    // Forward params when possible.
    var targetQueryData = targetUri.getQueryData();
    var currentQueryData = currentUri.getQueryData();
    goog.array.forEach(currentQueryData.getKeys(), function(key) {
      if (!targetQueryData.get(key)) {
        targetQueryData.set(key, currentQueryData.get(key));
      }
    });

    targetUri.setQueryData(targetQueryData);

    if (fu.env.runtime.USE_HISTORY_PUSH_STATE) {
      this._window.history['pushState']({}, '', targetUri.toString());
    } else {
      var uriStr = targetUri.toString();
      var path = uriStr.substr(uriStr.indexOf(targetUri.getPath()));
      this._window.location.hash = '!' + path;
    }
    return;
  }

  // Off-site URL.
  this._window.location.href = targetUri.toString();
};
