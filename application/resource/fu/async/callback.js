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
  this._onError = this._defaultOnError;

  /**
   * @type {fu.async.Callback}
   * @private
   */
  this._nextCallback = null;

  /**
   * @type {fu.async.Callback}
   * @private
   */
  this._prevCallback = null;

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
fu.async.Callback.WAIT_TIMEOUT_ = 30 * 1000;

/**
 * @type {number}
 * @private
 */
fu.async.Callback.WAIT_INTERVAL_ = 50;


/**
 * @param {Function|fu.async.Callback} condition
 * @param {number=} opt_timeout
 * @return {fu.async.Callback}
 */
fu.async.Callback.prototype.waitFor = function(condition, opt_timeout) {
  goog.asserts.assert(!this._processed, 'Already processed');
  goog.asserts.assert(!this._waitTimer, 'Already waiting');
  goog.asserts.assert(!this._nextCallback, 'nextCallback not null');

  goog.asserts.assert(
    goog.isFunction(condition) ||
      (/** @type {Object} */ (condition) instanceof fu.async.Callback),
    'invalid waitFor condition');

  if (condition instanceof fu.async.Callback) {
    var conditionCallback = /** @type {fu.async.Callback} */ (condition);
    var conditionPass = false;
    var conditionValue;
    var conditionFunc = function() {
      if (conditionPass) {
        return typeof conditionValue != 'undefined' ? conditionValue : null;
      } else {
        return undefined;
      }
    };
    conditionCallback.then(function(res) {
      conditionPass = true;
      conditionValue = res;
    });

    return this.waitFor(conditionFunc, opt_timeout);
  }

  var conditionFn = /** @type {Function} */ (condition);
  var startTime = goog.now();
  var timeout = goog.isNumber(opt_timeout) ?
    opt_timeout :
    fu.async.Callback.WAIT_TIMEOUT_;

  this._waitTimer = window.setInterval(goog.bind(function() {
    if (this._prevCallback && this._prevCallback._waitTimer) {
      return;
    }
    var res = conditionFn();
    if (typeof res != 'undefined') {
      this._unWait();
      this.succeed(res);
    } else if ((goog.now() - startTime) > timeout) {
      fu.logger.log('callback timeout', this);
      this._unWait();
      this.fail();
    }
  }, this), fu.async.Callback.WAIT_INTERVAL_);

  var callback = new fu.async.Callback();
  this._nextCallback = callback;
  callback._prevCallback = this;
  return callback;
};


/**
 * @param {...fu.async.Callback} var_args
 * @return {fu.async.Callback}
 */
fu.async.Callback.prototype.waitForCallbacks = function(var_args) {
  var values = [];
  var count = arguments.length;
  var callback = new fu.async.Callback();
  goog.array.forEach(arguments, function(arg, idx) {
    var argCallback = /** @type {fu.async.Callback} */ (arg);
    argCallback.then(function(response) {
      count--;
      values[idx] = response;
      idx = null;
    });
  });
  return callback.waitFor(function() {
    if (count === 0) {
      return values;
    }
  });
};


/**
 * @param {*} opt_data
 * @return {fu.async.Callback}
 */
fu.async.Callback.prototype.willSucceed = function(opt_data) {
  goog.asserts.assert(!this._nextCallback, 'nextCallback not null');

  var callback = new fu.async.Callback();
  this._nextCallback = callback;

  window.setTimeout(goog.bind(function() {
    this.succeed(opt_data);
    opt_data = null;
  }, this), 0);

  return callback;
};


/**
 * @param {*} opt_data
 * @return {fu.async.Callback}
 */
fu.async.Callback.prototype.willFail = function(opt_data) {
  goog.asserts.assert(!this._nextCallback, 'nextCallback not null');

  var callback = new fu.async.Callback();
  this._nextCallback = callback;

  window.setTimeout(goog.bind(function() {
    this.fail(opt_data);
    opt_data = null;
  }, this), 0);

  return callback;
};


/**
 * @param {*} opt_data
 */
fu.async.Callback.prototype.succeed = function(opt_data) {
  goog.asserts.assert(!this._processed, 'Already processed');
  goog.asserts.assert(!this._waitTimer, 'Still waiting');

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
  goog.asserts.assert(!this._waitTimer, 'Still waiting');

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
 * @param {Function=} opt_onError
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

/**
 * @private
 * @param {Object} response
 */
fu.async.Callback.prototype._defaultOnError = function(response) {
  fu.logger.log('Callback Error', response);
};

/**
 * @private
 */
fu.async.Callback.prototype._unWait = function() {
  window.clearInterval(this._waitTimer);
  this._waitTimer = 0;
};