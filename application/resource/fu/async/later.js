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
  this._timers = {};
};
goog.inherits(fu.async.Later, goog.Disposable);


/** @inheritDoc */
fu.async.Later.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.clearAll();
  this._timers = null;
};

/**
 * clearAll
 */
fu.async.Later.prototype.clearAll = function() {
  for (var timer in this._timers) {
    goog.Timer.clear(parseInt(timer, 10));
  }
  this._timers = {};
};


/**
 * @param {number} delay
 * @param {...*} var_args
 */
fu.async.Later.prototype.schedule = function(fn, delay, var_args) {
  var args = Array.prototype.slice.call(arguments, 2);
  var that = this;
  var timer = goog.Timer.callOnce(function() {
    delete that._timers[timer];
    var fnArgs = Array.prototype.slice.call(arguments, 0);
    fn.apply(that._context, fnArgs.concat(args));
    timer = args = fn = null;
  }, delay);
  this._timers[timer] = true;
};