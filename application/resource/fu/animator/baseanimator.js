goog.provide('fu.animator.BaseAnimator');
goog.provide('fu.animator.BaseAnimator.DELAY');

goog.require('fu.async.Later');
goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.dispose');
goog.require('goog.events.EventHandler');


/**
 * @extends {goog.Disposable}
 * @constructor
 */
fu.animator.BaseAnimator = function() {
  goog.base(this);

  /**
   * @type {boolean}
   * @private
   */
  this._playing = false;

  /**
   * @type {fu.async.Later}
   * @private
   */
  this._later = null;

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._handler = null;
};
goog.inherits(fu.animator.BaseAnimator, goog.Disposable);


/**
 * @enum {number}
 */
fu.animator.BaseAnimator.DELAY = {
  IMMEDIATE : 1,
  FAST : 250,
  MEDIUM : 600,
  SLOW : 800,
  VERY_SLOW : 2000
};


/**
 * @inheritDoc
 */
fu.animator.BaseAnimator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.stop();
  goog.dispose(this._later);
  goog.dispose(this._handler);
};

/**
 * @return {fu.async.Later}
 */
fu.animator.BaseAnimator.prototype.getLater = function() {
  if (!this._later) {
    this._later = new fu.async.Later(this);
  }
  return this._later;
};

/**
 * @return {goog.events.EventHandler}
 */
fu.animator.BaseAnimator.prototype.getHandler = function() {
  if (!this._handler) {
    this._handler = new goog.events.EventHandler(this);
  }
  return this._handler;
};

/**
 * play
 */
fu.animator.BaseAnimator.prototype.play = function() {
  if (this._playing) {
    this.stop();
  }
  this._playing = true;
  this.playInternal();
};


/**
 * stop
 */
fu.animator.BaseAnimator.prototype.stop = function() {
  if (this._playing) {
    this._playing = false;
    if (this._later) {
      this._later.clearAll();
    }
    if (this._handler) {
      this._handler.removeAll();
    }
    this.stopInternal();
  }
};


/**
 * Stop.
 */
fu.animator.BaseAnimator.prototype.stopInternal = goog.abstractMethod;


/**
 * Play
 */
fu.animator.BaseAnimator.prototype.playInternal = goog.abstractMethod;