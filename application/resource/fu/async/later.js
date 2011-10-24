goog.provide('fu.async.Later');

goog.require('goog.Timer');
goog.require('goog.Disposable');
goog.require('goog.dispose');


/**
 * @param {Object} context
 * @extends {goog.Disposable}
 * @constructor
 */
fu.async.Later = function(context) {
  goog.base(this);

  /**
   * @type {Object}
   * @private
   */
  this._context = context;

  /**
   * @type {Object}
   * @private
   */
  this._timeouts = {};

  /**
   * @type {Object}
   * @private
   */
  this._intervals = {};
};
goog.inherits(fu.async.Later, goog.Disposable);


/** @inheritDoc */
fu.async.Later.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.clearAll();
  this._timeouts = null;
  this._intervals = null;
};

/**
 * clearAll
 */
fu.async.Later.prototype.clearAll = function() {
  for (var timer in this._timeouts) {
    goog.Timer.clear(parseInt(timer, 10));
  }
  this._timeouts = {};

  for (var interval in this._intervals) {
    window.clearInterval(parseInt(interval, 10));
  }
  this._intervals = {};
};


/**
 * @param {number} delay
 * @param {...*} var_args
 */
fu.async.Later.prototype.schedule = function(fn, delay, var_args) {
  var args = Array.prototype.slice.call(arguments, 2);
  var that = this;
  var timer = goog.Timer.callOnce(function() {
    delete that._timeouts[timer];
    var fnArgs = Array.prototype.slice.call(arguments, 0);
    fn.apply(that._context, fnArgs.concat(args));
    timer = args = fn = null;
  }, delay);
  this._timeouts[timer] = true;
};


/**
 * @param {number} delay
 * @param {...*} var_args
 */
fu.async.Later.prototype.repeat = function(fn, delay, var_args) {
  var args = Array.prototype.slice.call(arguments, 2);
  var that = this;
  var interval = window.setInterval(function() {
    var fnArgs = Array.prototype.slice.call(arguments, 0);
    if (args.length) {
      fn.apply(that._context, fnArgs.concat(args));
    } else {
      fn.apply(that._context, fnArgs);
    }
  }, delay);
  this._intervals[interval] = true;
};