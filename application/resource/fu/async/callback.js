goog.provide('fu.async.Callback');

goog.require('fu.logger');
goog.require('goog.asserts');

/**
 * @constructor
 */
fu.async.Callback = function() {

  /**
   * @type {boolean}
   * @private
   */
  this._processed = false;

  /**
   * @type {boolean}
   * @private
   */
  this._thenCalled = false;

  /**
   * @type {Function}
   * @private
   */
  this._onSuccess = null;

  /**
   * @type {Function}
   * @private
   */
  this._onError = null;

  /**
   * @type {fu.async.Callback}
   * @private
   */
  this._nextCallback = null;

  /**
   * @type {number}
   * @private
   */
  this._waitTimer = 0;
};


/**
 * @type {number}
 * @private
 */
fu.async.Callback.WAIT_TIMEOUT_ = 10 * 1000;

/**
 * @type {number}
 * @private
 */
fu.async.Callback.WAIT_INTERVAL_ = 100;


/**
 * @param {Function} condition
 * @param {number=} opt_timeout
 */
fu.async.Callback.prototype.waitFor = function(condition, opt_timeout) {
  goog.asserts.assert(!this._processed, 'Already processed');
  goog.asserts.assert(!this._waitTimer, 'Already waiting');
  goog.asserts.assert(goog.isFunction(condition), 'invalid waitFor condition');

  var startTime = goog.now();
  var timeout = goog.isNumber(opt_timeout) ?
    opt_timeout :
    fu.async.Callback.WAIT_TIMEOUT_;

  this._waitTimer = window.setInterval(goog.bind(function() {
    var res = condition();
    if (typeof res != 'undefined') {
      this.succeed(res);
    } else if ((goog.now() - startTime) > timeout) {
      fu.logger.log('callback timeout', this);
      this.fail();
    }
  }, this), fu.async.Callback.WAIT_INTERVAL_);

  var callback = new fu.async.Callback();
  this._nextCallback = callback;
  return callback;
};


/**
 * @param {*} opt_data
 */
fu.async.Callback.prototype.willSucceed = function(opt_data) {
  window.setTimeout(goog.bind(function() {
    this.succeed(opt_data);
    opt_data = null;
  }, this), 0);
};


/**
 * @param {*} opt_data
 */
fu.async.Callback.prototype.willFail = function(opt_data) {
  window.setTimeout(goog.bind(function() {
    this.fail(opt_data);
    opt_data = null;
  }, this), 0);
};


/**
 * @param {*} opt_data
 */
fu.async.Callback.prototype.succeed = function(opt_data) {
  goog.asserts.assert(!this._processed, 'Already processed');

  if (this._waitTimer) {
    window.clearTimeout(this._waitTimer);
    this._waitTimer = 0;
  }

  this._processed = true;

  var next_data = opt_data;

  if (this._onSuccess) {
    next_data = this._onSuccess(opt_data);
    if (next_data instanceof fu.async.Callback) {
      if (this._nextCallback && this._nextCallback._onSuccess) {
        var callback = /** @type {fu.async.Callback} */ (next_data);
        callback.then(
          this._nextCallback._onSuccess,
          this._nextCallback._onError);
      }
      return;
    }
  }

  if (this._nextCallback && !this._nextCallback._waitTimer) {
    this._nextCallback.succeed(next_data);
  }
};


/**
 * @param {*} opt_data
 */
fu.async.Callback.prototype.fail = function(opt_data) {
  goog.asserts.assert(!this._processed, 'Already processed');

  if (this._waitTimer) {
    window.clearTimeout(this._waitTimer);
    this._waitTimer = 0;
  }

  this._processed = true;

  if (goog.isFunction(this._onError)) {
    this._onError(opt_data);
  }

  if (this._nextCallback) {
    this._nextCallback.fail(opt_data);
  }
};


/**
 * @param {Function|fu.async.Callback} callback
 * @param {Function} opt_onError
 * @return {fu.async.Callback}
 */
fu.async.Callback.prototype.then = function(callback, opt_onError) {
  goog.asserts.assert(callback, 'onSuccess null');
  goog.asserts.assert(!this._thenCalled, 'then() already called');

  this._thenCalled = true;

  if (goog.isFunction(opt_onError)) {
    this._onError = opt_onError;
  }

  if (goog.isFunction(callback)) {
    this._onSuccess = /** @type {Function} */ (callback);
    this._nextCallback = new fu.async.Callback();
  } else if (callback instanceof fu.async.Callback) {
    this._nextCallback = /** @type {fu.async.Callback} */ (callback);
  } else {
    goog.asserts.fail('Invalid callback');
  }

  return this._nextCallback;
};