goog.provide('fu.url.Dispatcher');

goog.require('fu.events.EventType');
goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * @param {Window} window
 * @constructor
 * @extends {goog.events.EventTarget}
 */
fu.url.Dispatcher = function(window) {
  goog.base(this);

  /**
   * @type {string}
   * @private
   */
  this._checkedUrl = '';

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._historyHandler = null;


  /**
   * @type {number}
   * @private
   */
  this._watchTimer = 0;

  /**
   * @type {string}
   * @private
   */
  this._dispatchedName = '';


  /**
   * @type {goog.Uri}
   * @private
   */
  this._resolvedUri = null;


  /**
   * @type {goog.Uri}
   * @private
   */
  this._dispatchedUri = null;


  /**
   * @type {Window}
   * @private
   */
  this._window = window;


  /**
   * @type {Array.<RegExp>}
   * @private
   */
  this._patterns = [];


  /**
   * @type {boolean}
   * @private
   */
  this._watching = false;


  /**
   * @type {Object}
   * @private
   */
  this._patternsName = {};
};
goog.inherits(fu.url.Dispatcher, goog.events.EventTarget);


/**
 * @param {boolean=} opt_resolve
 * @return {goog.Uri}
 */
fu.url.Dispatcher.getWindowUri = function(opt_resolve) {
  if (opt_resolve) {
    return fu.url.Dispatcher.resolve(window)
  }
  return new goog.Uri(window.location.href);
};


/**
 * @param {Window|string} source
 * @return {goog.Uri}
 */
fu.url.Dispatcher.resolve = function(source) {
  var urlStr = goog.isString(source) ? source : source.location.href;
  var uri = new goog.Uri(urlStr);
  if (uri.getFragment().indexOf('!/') === 0) {
    var tail = uri.getFragment().substr(1);
    urlStr = uri.getScheme() + '://' + uri.getDomain();
    urlStr += uri.getPort() ? ':' + uri.getPort() : '';
    urlStr += tail;
    return new goog.Uri(urlStr);
  }
  return uri;
};

/** @inheritDoc */
fu.url.Dispatcher.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this._patterns = null;
  this._patternsName = null;
  this.stopWatch();
};

/**
 * @param {string} name
 * @param {RegExp} var_args
 */
fu.url.Dispatcher.prototype.register = function(name, var_args) {
  var patterns = Array.prototype.slice.call(arguments, 1);
  goog.array.forEach(patterns, function(pattern) {
    this._patternsName[pattern.toString()] = name;
    this._patterns.push(pattern);
  }, this);
};


/**
 * @return {goog.Uri}
 */
fu.url.Dispatcher.prototype.getDispatchedUri = function() {
  return this._dispatchedUri;
};


/**
 * @return {string}
 */
fu.url.Dispatcher.prototype.getDispatchedName = function() {
  return this._dispatchedName;
};


/**
 * Watch
 */
fu.url.Dispatcher.prototype.startWatch = function() {
  if (this._watching) {
    return;
  }
  this._watching = true;

  this._historyHandler = new goog.events.EventHandler(this);

  this._historyHandler.listen(
    this._window,
    fu.events.EventType.HASHCHANGE,
    this._checkUri);

  this._historyHandler.listen(
    this._window,
    fu.events.EventType.POPSTATE,
    this._checkUri);

  this._watchTimer = this._window.setInterval(
    goog.bind(this._checkUri, this),
    800);

  this._checkUri();
};


/**
 * check
 */
fu.url.Dispatcher.prototype.check = function() {
  this._checkUri();
};


/**
 * stopWatch
 */
fu.url.Dispatcher.prototype.stopWatch = function() {
  if (!this._watching) {
    return;
  }
  this._watching = false;
  (/** @type {Window} */ (this._window)).clearInterval(this._watchTimer);
  this._historyHandler.dispose();
  this._historyHandler = null;
};


/**
 * @private
 */
fu.url.Dispatcher.prototype._checkUri = function() {
  var urlStr = this._window.location.href;
  if (this._checkedUrl == urlStr) {
    // this._dispatchEvent(this._dispatchedUri, this._dispatchedName, false);
    return;
  }

  this._checkedUrl = urlStr;

  var uri = fu.url.Dispatcher.resolve(urlStr);

  if (this._resolvedUri && uri.toString() == this._resolvedUri.toString()) {
    // this._dispatchEvent(this._dispatchedUri, this._dispatchedName, false);
    return;
  }

  this._resolvedUri = uri;
  var path = uri.getPath();

  goog.array.some(this._patterns, function(pattern) {
    var matched = path.match(pattern);
    if (matched) {
      this._dispatchedName = this._patternsName[pattern.toString()];

      var dispatchedUri = new goog.Uri(uri);
      var changed = (dispatchedUri.toString() == String(this._dispatchedUri));
      this._dispatchedUri = dispatchedUri;
      this._dispatchEvent(this._dispatchedUri, this._dispatchedName, changed);
      return true;
    }
  }, this);
};

/**
 * @param {goog.Uri} uri
 * @param {string} name
 * @param {boolean} changed
 */
fu.url.Dispatcher.prototype._dispatchEvent = function(uri, name, changed) {
  var evt = new fu.events.Event(fu.events.EventType.URL_DISPATCH, this);
  evt.uri = uri ? uri.clone() : null;
  evt.name = name;
  evt.changed = changed;
  this.dispatchEvent(evt);
};
