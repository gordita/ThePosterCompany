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
 * @param {Function=} opt_onComplete
 * @constructor
 * @extends {fu.animator.BaseAnimator}
 */
fu.animator.Positions = function(el, coords, duration, opt_onComplete) {
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
   * @type {Document}
   * @private
   */
  this._doc = goog.dom.getOwnerDocument(this._el);

  /**
   * @type {CSSStyleSheet}
   * @private
   */
  this._styleSheet = goog.dom.getOwnerDocument(this._el).styleSheets[0];


  /**
   * @type {number}
   * @private
   */
  this._duration = duration;

  /**
   * @type {string}
   * @private
   */
  this._animId = '';

  /**
   * @type {boolean}
   * @private
   */
  this._animating = false;

  /**
   * @type {Function}
   * @private
   */
  this._onComplete = opt_onComplete || null;
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
  if (fu.env.runtime.USE_WEBKIT_TRANSITION) {
    this._animating = true;

    this._animId = this._genAnimId();

    var endIndex = this._coords.length - 1;

    if (endIndex > 0) {
      var prevFrameIndex = -1;
      var lines = [];
      goog.array.forEach(this._coords, function(coord, idx) {
        var frameIndex = Math.ceil(idx / endIndex * 100);
        if (prevFrameIndex == frameIndex) {
          return;
        }
        prevFrameIndex = frameIndex;
        lines.push(frameIndex + '% {-webkit-transform: translate3d(' +
          coord.x + 'px,' +
          coord.y + 'px,' +
          '0)}');
      });
      var cssText = '@-webkit-keyframes  ' + this._animId + '{\n' +
        lines.join('\n') +
        '\n}';

      this._addRule(cssText);

      this.getHandler().listen(
        this._el,
        fu.events.EventType.ANIMATIONEND,
        this._onAnimationEnd);

      fu.style.setAnimation(this._el, this._animId, this._duration);
    }


    var lastCoord = goog.array.peek(this._coords);
    fu.style.setTranslate3d(this._el, lastCoord.x, lastCoord.y);

    if (endIndex == 0) {
      this.stop();
    }
  } else {
    // TODO(hedger): Use timer.
    goog.asserts.fail('animation is not supported');
    this.stop();
  }
};


/**
 * @param evt
 * @private
 */
fu.animator.Positions.prototype._onAnimationEnd = function(evt) {
  this._animating = false;
  this.stop();
};


/**
 * @inheritDoc
 */
fu.animator.Positions.prototype.stopInternal = function() {
  if (!this._coords.length) {
    return;
  }
  if (fu.env.runtime.USE_WEBKIT_TRANSITION) {
    if (this._animating) {
      fu.style.pauseAnimation(this._el);
      var pos = fu.style.getTranslatePosition(this._el);
      fu.style.setTranslate3d(this._el, pos.x, pos.y);
      var el = this._el;
      var animId = this._animId;
      window.setTimeout(goog.bind(function() {
        if (el.style.cssText.indexOf(animId) > -1) {
          fu.style.removeAnimation(el);
        }
      }, this), 0);
      this._animating = false;
    } else {
      fu.style.removeAnimation(this._el);
      this._removeRule(this._animId);
    }
    this.getHandler().removeAll();
  }
};


/**
 * @return {string}
 * @private
 */
fu.animator.Positions.prototype._genAnimId = function() {
  return 'AnimIDPositions' + fu.id.IdGenerator.next();
};

/**
 * @param {string} cssText
 * @private
 */
fu.animator.Positions.prototype._addRule = function(cssText) {
  this._styleSheet.insertRule(cssText, 0);
};

/**
 * @param {string} animId
 * @private
 */
fu.animator.Positions.prototype._removeRule = function(animId) {
  if (!animId) {
    return;
  }
  var rules = this._styleSheet.cssRules;
  goog.array.some(rules, function(rule, idx) {
    if (rule.cssText.indexOf(animId) > 0) {
      this._styleSheet.deleteRule(idx);
      return true;
    }
    if (idx > 20) {
      // Too many rules, just exit.
      return true;
    }
  }, this);
};




