goog.provide('fu.animator.Position');

goog.require('fu.animator.BaseAnimator');
goog.require('fu.animator.BaseAnimator.DELAY');
goog.require('fu.env.runtime');
goog.require('fu.events.EventType');
goog.require('fu.style');
goog.require('goog.math.Coordinate');
goog.require('goog.style');


/**
 * @param {Element} el
 * @param {goog.math.Coordinate} endPos
 * @constructor
 * @extends {fu.animator.BaseAnimator}
 */
fu.animator.Position = function(el, endPos) {
  goog.base(this);

  /**
   * @type {Element}
   * @private
   */
  this._el = el;

  /**
   * @type {goog.math.Coordinate}
   * @private
   */
  this._endPos = endPos;

  /**
   * @type {boolean}
   * @private
   */
  this._transition = false;
};
goog.inherits(fu.animator.Position, fu.animator.BaseAnimator);


/**
 * @inheritDoc
 */
fu.animator.Position.prototype.playInternal = function() {
  if (fu.env.runtime.USE_WEBKIT_TRANSITION) {
    this._transition = true;

    fu.style.setTransformTransition(
      this._el,
      fu.animator.BaseAnimator.DELAY.FAST);

    this.getHandler().listen(
      this._el,
      fu.events.EventType.TRANSITIONEND,
      this._onTransitionEnd);

    this.getLater().schedule(
      function() {
        fu.style.setTranslate3d(this._el, this._endPos.x, this._endPos.y);
      },
      fu.animator.BaseAnimator.DELAY.IMMEDIATE);

    this.getLater().schedule(
      this.stop,
      fu.animator.BaseAnimator.DELAY.SLOW);

  } else {
    goog.style.setPosition(this._el, this._endPos.x, this._endPos.y);
    this.stop();
  }
};


/**
 * @param evt
 * @private
 */
fu.animator.Position.prototype._onTransitionEnd = function(evt) {
  this._transition = false;
  this.stopInternal();
};


/**
 * @inheritDoc
 */
fu.animator.Position.prototype.stopInternal = function() {
  if (this._transition && fu.env.runtime.USE_WEBKIT_TRANSITION) {
    var pos = fu.style.getTranslatePosition(this._el);
    fu.style.removeTransition(this._el);
    fu.style.setTranslate3d(this._el, pos.x, pos.y);
  }
  this._transition = false;

  if (fu.env.runtime.USE_WEBKIT_TRANSITION) {
    fu.style.removeTransition(this._el);
  }
};





