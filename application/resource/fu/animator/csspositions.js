goog.provide('fu.animator.CSSPositions');

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
fu.animator.CSSPositions = function(el, coords, duration) {
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
  this._cssAnimName = '';

  /**
   * @type {boolean}
   * @private
   */
  this._animating = false;
};
goog.inherits(fu.animator.CSSPositions, fu.animator.BaseAnimator);


/**
 * @inheritDoc
 */
fu.animator.CSSPositions.prototype.playInternal = function() {
  if (!this._coords.length) {
    this.stop();
    return;
  }

  this._animating = true;
  this._animByCSS();
};


/**
 * @private
 */
fu.animator.CSSPositions.prototype._animByCSS = function() {
  goog.asserts.assert(
    fu.env.runtime.USE_WEBKIT_TRANSITION,
    'CSS Animation not supported');

  this._cssAnimName = this._genCSSAnimName();

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
    var cssText = '@-webkit-keyframes  ' + this._cssAnimName + '{\n' +
      lines.join('\n') +
      '\n}';


    this.getHandler().listen(
      this._el,
      fu.events.EventType.ANIMATIONEND,
      this._onAnimationEnd);

    fu.style.setAnimation(this._el, this._cssAnimName, this._duration);
    this._addCSSAnimRule(cssText);
  }

  var lastCoord = goog.array.peek(this._coords);
  fu.style.setTranslate3d(this._el, lastCoord.x, lastCoord.y);

  if (endIndex == 0) {
    this.stop();
  }
};

/**
 * @param evt
 * @private
 */
fu.animator.CSSPositions.prototype._onAnimationEnd = function(evt) {
  this._animating = false;
  this.stop();
};

/**
 * @inheritDoc
 */
fu.animator.CSSPositions.prototype.stopInternal = function() {
  if (!this._coords.length) {
    return;
  }

  this.getHandler().removeAll();

  if (this._animating) {
    fu.style.pauseAnimation(this._el);
    var pos = fu.style.getTranslatePosition(this._el);
    fu.style.setTranslate3d(this._el, pos.x, pos.y);
    window.setTimeout(goog.bind(function() {
      if (this._el.style.cssText.indexOf(this._cssAnimName) > -1) {
        fu.style.removeAnimation(this._el);
        this._removeCSSAnimRule(this._cssAnimName);
      }
    }, this), 0);
    this._animating = false;
  } else {
    fu.style.removeAnimation(this._el);
    this._removeCSSAnimRule(this._cssAnimName);
  }
};


/**
 * @return {string}
 * @private
 */
fu.animator.CSSPositions.prototype._genCSSAnimName = function() {
  return 'AnimIDPositions' + fu.id.IdGenerator.next();
};

/**
 * @param {string} cssText
 * @private
 */
fu.animator.CSSPositions.prototype._addCSSAnimRule = function(cssText) {
  this._styleSheet.insertRule(cssText, 0);
};

/**
 * @param {string} animName
 * @private
 */
fu.animator.CSSPositions.prototype._removeCSSAnimRule = function(animName) {
  if (!animName) {
    return;
  }
  var rules = this._styleSheet.cssRules;
  goog.array.some(rules, function(rule, idx) {
    if (rule.cssText.indexOf(animName) > 0) {
      this._styleSheet.deleteRule(idx);
      return true;
    }
    if (idx > 20) {
      // Too many rules, just exit.
      return true;
    }
  }, this);
};