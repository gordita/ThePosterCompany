goog.provide('fu.animator.Positions');

goog.require('fu.animator.BaseAnimator');
goog.require('fu.animator.BaseAnimator.DELAY');
goog.require('fu.env.runtime');
goog.require('fu.events.EventType');
goog.require('fu.id.IdGenerator');
goog.require('fu.style');
goog.require('goog.asserts');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.math.Coordinate');
goog.require('goog.style');


/**
 * @param {Element} el
 * @param {Array.<goog.math.Coordinate>} coords
 * @param {number} duration
 * @constructor
 * @extends {fu.animator.BaseAnimator}
 */
fu.animator.Positions = function(el, coords, duration) {
  goog.base(this);

  /**
   * @type {Element}
   * @private
   */
  this._el = el;

  /**
   * @type {Array.<goog.math.Coordinate>}
   * @private
   */
  this._coords = coords;

  /**
   * @type {number}
   * @private
   */
  this._duration = duration;

  /**
   * @type {boolean}
   * @private
   */
  this._animating = false;

  /**
   * @type {Array.<Function>}
   * @private
   */
  this._frames = [];
};
goog.inherits(fu.animator.Positions, fu.animator.BaseAnimator);


/**
 * @inheritDoc
 */
fu.animator.Positions.prototype.playInternal = function() {
  if (!this._coords.length) {
    this.stop();
    return;
  }
  this._animByTimer();
};

/**
 * @private
 */
fu.animator.Positions.prototype._animByTimer = function() {
  this._animating = true;

  fu.style.setTransformTransition(this._el, 0, 'linear');
  this._frames = goog.array.map(this._coords, function(coord) {
    return goog.bind(
      fu.style.setTranslate3d,
      null,
      this._el,
      coord.x,
      coord.y);
  }, this);
  if (this._frames.length) {
    var interval = this._duration / this._frames.length;
    this.getLater().repeat(this._playFrame, interval);
    this._playFrame();
  }
};

/**
 * @inheritDoc
 */
fu.animator.Positions.prototype.stopInternal = function() {
  if (!this._coords.length) {
    return;
  }

  if (this._animating) {
    fu.style.removeTransition(this._el);
    this.getLater().clearAll();
    this._animating = false;
  }
};


/**
 * @private
 */
fu.animator.Positions.prototype._playFrame = function() {
  var frame = this._frames.shift();
  if (!frame) {
    this.stop();
  } else {
    frame.call(this);
  }
};