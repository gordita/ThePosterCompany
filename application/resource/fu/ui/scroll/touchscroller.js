goog.provide('fu.ui.scroll.TouchScroller');
goog.provide('fu.ui.scroll.TouchScrollerMovingContext');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Coordinate');
goog.require('fu.env.client');
goog.require('fu.env.name');
goog.require('fu.events.EventType');
goog.require('fu.events.TouchEvent');
goog.require('fu.ui.scroll.Scrollable');


/**
 * @param {Element|string} ref
 * @constructor
 * @implements {fu.ui.scroll.Scrollable}
 * @extends {goog.events.EventTarget}
 */
fu.ui.scroll.TouchScroller = function(ref) {
  goog.asserts.assert(fu.ui.scroll.TouchScroller.isCompatible());

  goog.base(this);

  /**
   * @type {Element}
   * @private
   */
  this._el = goog.dom.getElement(ref);

  /**
   * @type {Element}
   * @private
   */
  this._body = goog.dom.getFirstElementChild(this._el);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._handler = new goog.events.EventHandler(this);

  /**
   * @type {Document}
   * @private
   */
  this._doc = goog.dom.getOwnerDocument(this._el);


  /**
   * @type {Window}
   * @private
   */
  this._win = goog.dom.getWindow(this._doc);

  /**
   * @type {number}
   * @private
   */
  this._x = 0;

  /**
   * @type {number}
   * @private
   */
  this._y = 0;

  /**
   * @type {Object}
   * @private
   */
  this._moveContext = {};

  this._initStyle();
  this._waitStart();
};
goog.inherits(fu.ui.scroll.TouchScroller, goog.events.EventTarget);

/**
 * @return {boolean}
 */
fu.ui.scroll.TouchScroller.isCompatible = function() {
  return fu.env.client.USE_WEBKIT_CSS3D &&
    fu.env.client.USE_WEBKIT_TRANSITION;
};


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.MIN_SCROLL_START_DELTA = 2;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.MAX_VELOCITY = 5;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.TAU = 1 / 256;  // (1/ms)

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.DECELERATE_EPSILON = 3;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.LIMIT_OFFSET = 50;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.SPRING_EPSILON = 6;


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.OMEGA = 0.5 / 32;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL = 50;

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.disposeInternal = function() {
  this._handler.dispose();
};

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.scrollTo = function(x, y) {
  x = 0;
  y = goog.math.clamp(y, 0, this._getMaxScrollTop());
  this._scrollTo(x, y);
};


/**
 * @param {number} x
 * @param {number} y
 */
fu.ui.scroll.TouchScroller.prototype._scrollTo = function(x, y) {
  if (this._x === x && this._y === y) {
    return;
  }
  this._x = x;
  this._y = y;
  this._translateTo(x, y);
};


/**
 *  @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.getScrollHeight = function() {
  return this._body.offsetHeight;
};

/**
 *  @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.getScrollLeft = function() {
  return this._x;
};

/**
 *  @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.getScrollTop = function() {
  return this._y;
};

/**
 * @return {number}
 */
fu.ui.scroll.TouchScroller.prototype._getMaxScrollTop = function() {
  return this.getScrollHeight() - this._el.offsetHeight;
};

/**
 * @param {number} x
 * @param {number} y
 */
fu.ui.scroll.TouchScroller.prototype._translateTo = function(x, y) {
  x = -x;
  y = -y;
  if (fu.env.client.USE_WEBKIT_CSS3D) {
    this._body.style[fu.env.name.STYLE_TRANSFORM] =
      'translate3d(' + x + 'px,' + y + 'px,0)';
  } else {
    throw new Error('CSS3D not supported');
  }
};


/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._initStyle = function() {
  this._el.style.overflow = 'hidden';
  this._scrollTo(0, 0);
};

/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._waitStart = function() {
  this._handler.listen(
    this._el,
    fu.events.EventType.TOUCHSTART,
    this._onStart,
    false);
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @return {boolean}
 */
fu.ui.scroll.TouchScroller.prototype._onEvent = function(evt) {
  var be = evt.getBrowserEvent();
  return !!be['defaultPrevented'];
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onStart = function(evt) {
  this._clearTransition();

  if (this._onEvent(evt)) {
    return;
  }

  this._handler.removeAll();

  var coord = this._getTouchCoord(evt);
  var ctx = this._moveContext;
  ctx.scrolling = false;
  ctx.startTouchCoord = coord;

  this._handler.listen(
    this._doc,
    fu.events.EventType.TOUCHMOVE,
    this._onMove,
    true);

  this._handler.listen(
    this._doc,
    fu.events.EventType.TOUCHEND,
    this._onEnd,
    true);
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onMove = function(evt) {
  if (this._onEvent(evt)) {
    return;
  }
  var coord = this._getTouchCoord(evt);
  var ctx = this._moveContext;
  var now = goog.now();
  var dy = coord.y - ctx.startTouchCoord.y;
  if (!ctx.scrolling) {
    if (Math.abs(dy) < fu.ui.scroll.TouchScroller.MIN_SCROLL_START_DELTA) {
      return;
    }
    ctx.scrolling = true;
    ctx.minY = 0;
    ctx.maxY = this._getMaxScrollTop();
    ctx.startX = this._x;
    ctx.startY = this._y;
    ctx.startTime = now;
    ctx.startTouchCoord = coord;
    ctx.lastTouchCoord = coord;
    ctx.currentTouchCoord = coord;
    ctx.currentTime = now;
    ctx.previousTime = now;
  } else if (ctx.scrolling) {
    evt.preventDefault();
    ctx.previousTime = ctx.currentTime;
    ctx.currentTime = now;
    ctx.lastTouchCoord = ctx.currentTouchCoord;
    ctx.currentTouchCoord = coord;

    var y = ctx.startY - dy;
    this._scrollTo(this._x, y);
  }
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onEnd = function(evt) {
  this._handler.removeAll();
  var ctx = this._moveContext;
  if (ctx.scrolling) {
    ctx.scrolling = false;

    var dy = ctx.currentTouchCoord.y - ctx.lastTouchCoord.y;
    var dt = ctx.currentTime - ctx.previousTime;
    if (this._y < ctx.minY) {
      this._boundTo(0, ctx.minY);
    } else if (this._y > ctx.maxY) {
      this._boundTo(0, ctx.maxY);
    } else {
      var v;
      v = (dy / dt) || 1;
      v *= Math.min(1, fu.ui.scroll.TouchScroller.MAX_VELOCITY / Math.abs(v));

      // Do some fall off if the user holds in place after scrolling
      v *= Math.max(0, 1 - (goog.now() - ctx.currentTime) / 250);

      this._decelerateTo(
        this._x,
        this._y,
        -v,
        ctx.previousTime);
    }
  } else {
    this._moveContext = {};
  }
  this._waitStart();
};


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} startV
 * @param {number} startTime
 */
fu.ui.scroll.TouchScroller.prototype._decelerateTo = function(startX, startY,
                                                              startV,
                                                              startTime) {
  var tau = fu.ui.scroll.TouchScroller.TAU;
  var eps = fu.ui.scroll.TouchScroller.DECELERATE_EPSILON;
  var interval = fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
  var y1 = startY + startV / tau;
  var y0;
  var pp;
  var duration = goog.now() - startTime;
  do {
    duration += interval;
    pp = startV / tau * Math.exp(-tau * duration);
    y0 = y1 - pp;
  } while (Math.abs(pp) > eps);

  var ctx = this._moveContext;
  y1 = goog.math.clamp(
    y1,
    ctx.minY - fu.ui.scroll.TouchScroller.LIMIT_OFFSET,
    ctx.maxY + fu.ui.scroll.TouchScroller.LIMIT_OFFSET);
  this._applyTransition(startX, Math.round(y1), duration);
};


/**
 * @param {number} endX
 * @param {number} endY
 */
fu.ui.scroll.TouchScroller.prototype._boundTo = function(endX, endY) {
  var velocity = (this._y / fu.ui.scroll.TouchScroller.TAU);
  velocity = velocity *
    Math.min(1, fu.ui.scroll.TouchScroller.MAX_VELOCITY / Math.abs(velocity));

  var startTime = goog.now();
  var y0 = this._y;
  var dy0 = endY - y0;
  var duration = goog.now() - startTime;
  var interval = fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
  var omega = fu.ui.scroll.TouchScroller.OMEGA;
  var eps = fu.ui.scroll.TouchScroller.SPRING_EPSILON;
  var pos;
  var pp;
  do {
    duration += interval;
    pp = (dy0 + (-endX,endY,velocity + dy0 * omega) * duration) *
      Math.exp(-omega * duration);
    pos = endY - pp;

  } while (pp && Math.abs(pp) < eps);
  this._applyTransition(endX, endY, duration);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} duration
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._applyTransition = function(x, y,
                                                                 duration) {
  duration = duration < 200 ? 200 : duration;
  this._handler.listenOnce(
    this._body,
    fu.events.EventType.TRANSITIONEND,
    this._onTransitionEnd,
    true);

  // The values of cubic-bezier(*) is generated by
  // http://matthewlein.com/ceaser/ which gives us natural-enough animation.
  this._body.style[fu.env.name.STYLE_TRANSITION] =
    fu.env.name.STYLE_TRANSFORM_CSS_TEXT + ' ' +
      Math.round(duration) + 'ms cubic-bezier(0, 0.02, 0.055, 1)';

  var ctx = this._moveContext;
  ctx.animating = true;
  ctx.transitionDuration = duration;
  this._scrollTo(x, y);
};

/**
 * @param {boolean=} opt_finished
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._clearTransition = function(opt_finished) {
  if (this._moveContext.animating) {
    this._moveContext.animating = false;
    if (!opt_finished) {
      var coord = this._getTransitionPosition();
      var ctx = this._moveContext;
      if (ctx.startTouchCoord) {
        var now = goog.now();
        var duration = now - ctx.startTime;
        var velocity = (-coord.y - ctx.startY) / (duration);
        var timeRemaining = Math.max(0, ctx.transitionDuration - duration);
        var diff = velocity * timeRemaining /
          fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
        // On Webkit, the calculated "pos" is the position of the previous
        // transition frame instead the one that is being rendered on screen.
        // We need to add extra "diff" to get the current transition position.
        coord.y -= Math.round(diff);
      }
      this._scrollTo(-coord.x, -coord.y);
    }
    this._body.style[fu.env.name.STYLE_TRANSITION] = '';
  }
};

/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onTransitionEnd = function() {
  if (this._moveContext.animating) {
    var ctx = this._moveContext;
    if (this._y < ctx.minY) {
      this._boundTo(this._x, ctx.minY);
    } else if (this._y > ctx.maxY) {
      this._boundTo(this._x, ctx.maxY);
    } else {
      this._clearTransition();
    }
  }
};

/**
 * @return {goog.math.Coordinate}
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._getTransitionPosition = function() {
  var CSSMatrix = /** @type {Function} */ (this._win['WebKitCSSMatrix']);
  var style = this._doc.defaultView.getComputedStyle(this._body, null);
  var transform = new CSSMatrix(style['webkitTransform']);
  var x = parseFloat(transform['m41']);
  var y = parseFloat(transform['m42']);
  return new goog.math.Coordinate(x, y);
};

/**
 *
 * @param @param {goog.events.BrowserEvent} evt
 * @return {goog.math.Coordinate}
 */
fu.ui.scroll.TouchScroller.prototype._getTouchCoord = function(evt) {
  var touch = fu.events.TouchEvent.getTouch(evt);
  return new goog.math.Coordinate(touch.pageX, touch.pageY);
};