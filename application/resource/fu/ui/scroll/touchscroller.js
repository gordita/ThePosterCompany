goog.provide('fu.ui.scroll.TouchScroller');

goog.require('fu.env.runtime');
goog.require('fu.events');
goog.require('fu.events.EventType');
goog.require('fu.style');
goog.require('fu.ui.scroll.Scrollable');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Coordinate');


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

  goog.asserts.assert(this._body, 'scroll body is null');

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

  /**
   * @type {boolean}
   * @private
   */
  this._horizontal = false;

  /**
   * @type {boolean}
   * @private
   */
  this._snap = false;

  /**
   * @type {boolean}
   * @private
   */
  this._initialized = false;

  this._scrollTo(0, 0);
  this._listenStart();

  this._initialized = true;
};
goog.inherits(fu.ui.scroll.TouchScroller, goog.events.EventTarget);

/**
 * @return {boolean}
 */
fu.ui.scroll.TouchScroller.isCompatible = function() {
  return fu.env.runtime.USE_WEBKIT_CSS3D &&
    fu.env.runtime.USE_WEBKIT_TRANSITION;
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
fu.ui.scroll.TouchScroller.TAU = 1 / 1000;  // (1/ms)

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.DECELERATE_EPSILON = 3;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.LIMIT_OFFSET = 80;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.SPRING_EPSILON = 500;


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.OMEGA = 1 / 100;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL = 50;

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.disposeInternal = function() {
  this._handler.dispose();
  this._clearTransition();
};

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.setScrollable = function(scrollable) {
  this._handler.removeAll();
  if (scrollable) {
    this._listenStart();
  }
};

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.scrollTo = function(x, y) {
  if (this._horizontal) {
    y = 0;
    x = goog.math.clamp(x, 0, this._getMaxScrollLeft());
  } else {
    x = 0;
    y = goog.math.clamp(y, 0, this._getMaxScrollTop());
  }

  if (this._moveContext.animating) {
    this._clearTransition();
  }

  this._scrollTo(x, y);
};


/**
 *  @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.getScrollHeight = function() {
  return this._body.scrollHeight;
};

/**
 *  @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.getScrollWidth = function() {
  return this._body.scrollWidth;
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
fu.ui.scroll.TouchScroller.prototype._getMaxScrollLeft = function() {
  return this.getScrollWidth() - this._el.offsetWidth;
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
fu.ui.scroll.TouchScroller.prototype._scrollTo = function(x, y) {
  if (this._x === x && this._y === y) {
    return;
  }
  this._x = x;
  this._y = y;
  this._translateTo(x, y);
};


/**
 * @param {number} x
 * @param {number} y
 */
fu.ui.scroll.TouchScroller.prototype._translateTo = function(x, y) {
  x = -x;
  y = -y;
  fu.style.setTranslate3d(this._body, x, y);
};


/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._listenStart = function() {
  this._preventClickTime = null;

  this._handler.listen(
    this._el,
    fu.events.EventType.TOUCHSTART,
    this._onStart,
    false);
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onStart = function(evt) {
  this._clearTransition();
  if (fu.events.isPrevented(evt)) {
    return;
  }

  this._handler.removeAll();

  var coord = fu.events.getTouchPagePosition(evt);
  var ctx = this._moveContext = {};
  ctx.scrolling = false;
  ctx.startTouchCoord = coord;
  ctx.pageOffsetCoord = new goog.math.Coordinate(
    window.pageXOffset,
    window.pageYOffset
  );

  this._handler.listen(
    this._doc.body,
    fu.events.EventType.TOUCHMOVE,
    this._onMove,
    true);

  this._handler.listen(
    this._doc.body,
    fu.events.EventType.TOUCHEND,
    this._onEnd,
    true);

  this._handler.listen(
    this._doc.body,
    fu.events.EventType.CLICK,
    this._onClick,
    true);
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onMove = function(evt) {
  var context = this._moveContext;

  if (fu.events.isPrevented(evt) ||
    context.pageOffsetCoord.x != window.pageXOffset ||
    context.pageOffsetCoord.y != window.pageYOffset) {
    this._onEnd(evt);
    return;
  }

  var coord = fu.events.getTouchPagePosition(evt);
  var now = goog.now();
  var dx = coord.x - context.startTouchCoord.x;
  var dy = coord.y - context.startTouchCoord.y;
  var abs_dx = Math.abs(dx);
  var abs_dy = Math.abs(dy);
  if (!context.scrolling) {
    if (this._horizontal) {
      if (abs_dx < fu.ui.scroll.TouchScroller.MIN_SCROLL_START_DELTA ||
        abs_dx < abs_dy) {
        return;
      }
    } else {
      if (abs_dy < fu.ui.scroll.TouchScroller.MIN_SCROLL_START_DELTA ||
        abs_dy < abs_dx) {
        return;
      }
    }
    context.scrolling = true;
    context.minX = context.minY = 0;
    context.maxX = this._getMaxScrollLeft();
    context.maxY = this._getMaxScrollTop();
    context.startX = this._x;
    context.startY = this._y;

    context.startTime =
      context.currentTime =
        context.previousTime = now;

    context.startTouchCoord = coord.clone();
    context.lastTouchCoord = coord.clone();
    context.currentTouchCoord = coord.clone();

  } else if (context.scrolling) {
    evt.preventDefault();
    context.previousTime = context.currentTime;
    context.currentTime = now;

    if (!goog.math.Coordinate.equals(context.lastTouchCoord, coord)) {
      context.lastTouchCoord = context.currentTouchCoord.clone();
      context.currentTouchCoord = coord.clone();
    }

    var x;
    var y;
    if (this._horizontal) {
      x = context.startX - dx;
      y = this._y;
      if (x < context.minX) {
        dx = context.minX - x;
        x *= 1 / Math.max(0.2, Math.log(dx) / 2);
      } else if (x > context.maxX) {
        dx = x - context.maxX;
        x = context.maxX + dx / Math.max(0.2, Math.log(dx) / 2);
      }
    } else {
      x = this._x;
      y = context.startY - dy;
      if (y < context.minY) {
        dy = context.minY - y;
        y *= 1 / Math.max(0.2, Math.log(dy) / 2);
      } else if (y > context.maxY) {
        dy = y - context.maxY;
        y = context.maxY + dy / Math.max(0.2, Math.log(dy) / 2);
      }
    }
    this._scrollTo(x, y);
  }
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onEnd = function(evt) {
  this._handler.removeAll();
  var context = this._moveContext;
  if (context.scrolling) {
    context.scrolling = false;

    var dx = context.currentTouchCoord.x - context.lastTouchCoord.x;
    var dy = context.currentTouchCoord.y - context.lastTouchCoord.y;
    var dt = context.currentTime - context.previousTime;

    var velocity;
    var distance = this._horizontal ? dx : dy;
    velocity = (distance / dt) || 1;
    velocity *= Math.min(
      1,
      fu.ui.scroll.TouchScroller.MAX_VELOCITY / Math.abs(velocity));

    // Do some fall off if the user holds in place after scrolling
    velocity *= Math.max(0, 1 - (Date.now() - context.currentTime) / 50);

    if (this._snap) {
      if (this._horizontal) {
        var width = this._body.offsetWidth;
        var rx = width % this._x;
        var snap_x;
        if (rx) {
          snap_x = dx < 0 ?
            Math.ceil(this._x / width) * width :
            Math.floor(this._x / width) * width;
          context.snapX = goog.math.clamp(
            snap_x,
            context.minX,
            context.maxX);
        } else {
          context.snapX = 0;
        }
      } else {
        var height = this._body.offsetHeight;
        var ry = height % this._y;
        var snap_y;
        if (ry) {
          snap_y = dy < 0 ?
            Math.ceil(this._y / height) * height :
            Math.floor(this._y / height) * height;
          context.snapY = goog.math.clamp(
            snap_y,
            context.minY,
            context.maxY);
        } else {
          context.snapY = 0;
        }
      }
    }

    var x = this._x;
    var y = this._y;
    var decelerated;

    if (goog.isNumber(context.snapX)) {
      x = context.snapX;
    } else if (goog.isNumber(context.snapY)) {
      y = context.snapY;
    } else if (this._horizontal && this._x < context.minX) {
      x = context.minX;
    } else if (this._horizontal && this._x > context.maxX) {
      x = context.maxX;
    } else if (this._y < context.minY) {
      y = context.minY;
    } else if (this._y > context.maxY) {
      y = context.maxY;
    } else {
      decelerated = true;
      this._decelerateTo(
        this._x,
        this._y,
        -velocity,
        context.previousTime);
    }

    if (!decelerated) {
      velocity = this._horizontal ?
        (x - this._x) :
        (y - this._y);
      this._bounceTo(x, y, velocity);
    }

    evt.preventDefault();
  } else {
    this._moveContext = {};
  }
  this._listenStart();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onClick = function(evt) {
  if (this._moveContext.scrolling) {
    evt.preventDefault();
  }
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} v
 * @param {number} startTime
 */
fu.ui.scroll.TouchScroller.prototype._decelerateTo = function(x, y, v,
                                                              startTime) {
  // The initial position (x, y) and the initial speed (v) is known,
  // need to figure out the end (x, y) and the time it takes to reduce
  // the speed to zero.
  var tau = fu.ui.scroll.TouchScroller.TAU;
  var epsilon = fu.ui.scroll.TouchScroller.DECELERATE_EPSILON;
  var interval = fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
  var context = this._moveContext;
  var v2 = Math.abs(v / 2);
  if (this._horizontal) {
    x = goog.math.clamp(
      x + v / tau,
      context.minX - v2 * fu.ui.scroll.TouchScroller.LIMIT_OFFSET,
      context.maxX + v2 * fu.ui.scroll.TouchScroller.LIMIT_OFFSET
    );
  } else {
    y = goog.math.clamp(
      y + v / tau,
      context.minY - v2 * fu.ui.scroll.TouchScroller.LIMIT_OFFSET,
      context.maxY + v2 * fu.ui.scroll.TouchScroller.LIMIT_OFFSET
    );
  }

  var position;
  var duration = goog.now() - startTime;

  do {
    duration += interval;
    position = v / tau * Math.exp(-tau * duration);
  } while (Math.abs(position) > epsilon);

  this._applyTransition(Math.round(x), Math.round(y), duration);
};


/**
 * @param {number} x
 * @param {number} y
 * @param {number} v
 */
fu.ui.scroll.TouchScroller.prototype._bounceTo = function(x, y, v) {
  // The end position (x, y) and the initial speed (v) is known,
  // need to figure out the time it takes to get to the end point (x, y).
  var interval = fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
  var omega = fu.ui.scroll.TouchScroller.OMEGA;
  var eps = fu.ui.scroll.TouchScroller.SPRING_EPSILON;
  var start = this._horizontal ? this._x : this._y;
  var end = this._horizontal ? x : y;
  var distance = end - start;
  var duration = 0;
  var position;

  do {
    duration += interval;
    position = (distance + (-v + distance * omega) * duration) *
      Math.exp(-omega * duration);
  } while (position && Math.abs(position) < eps);

  this._applyTransition(x, y, duration);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} duration
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._applyTransition = function(x, y,
                                                                 duration) {
  duration = goog.math.clamp(duration, 100, 1000);
  this._handler.listenOnce(
    this._body,
    fu.events.EventType.TRANSITIONEND,
    this._onTransitionEnd,
    true);

  fu.style.setTransformTransition(this._body, duration);
  var context = this._moveContext;
  context.animating = true;
  context.animStartTime = goog.now();
  context.animStartCoord = new goog.math.Coordinate(this._x, this._y);
  context.transitionDuration = duration;
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
      // Transition has been cancelled.
      var coord = fu.style.getTranslatePosition(this._body);
      var context = this._moveContext;
      if (context.startTouchCoord) {
        var duration = goog.now() - context.startTime;
        var distance;
        if (this._horizontal) {
          distance = -coord.x - context.startX;
        } else {
          distance = -coord.y - context.startY;
        }
        var velocity = -distance / duration;
        var timeLeft = Math.max(0, context.transitionDuration - duration);
        var diff = velocity * timeLeft /
          fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL;
        // On Webkit, the calculated "pos" is the position of the previous
        // transition frame instead the one that is being rendered on screen.
        // We need to add extra "diff" to get the current transition position.
        if (this._horizontal) {
          coord.x += Math.round(diff);
        } else {
          coord.y += Math.round(diff);
        }
      }
      this._scrollTo(-coord.x, -coord.y);
    }
    fu.style.removeTransition(this._body);
  }
};

/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onTransitionEnd = function() {
  if (this._moveContext.animating) {
    var context = this._moveContext;
    var distance = this._horizontal ?
      this._x - context.animStartCoord.x :
      this._y - context.animStartCoord.y;

    var velocity = distance / (goog.now() - context.animStartTime);
    var done = false;
    var x = this._x;
    var y = this._y;

    if (goog.isNumber(context.snapX) || goog.isNumber(context.snapY)) {
      // Already moved to the desired snap point.
      // Clear the transition.
      done = true;
    } else if (this._horizontal && this._x < context.minX) {
      x = context.minX;
    } else if (this._horizontal && this._x > context.maxX) {
      x = context.maxX;
    } else if (this._y < context.minY) {
      y = context.minY;
    } else if (this._y > context.maxY) {
      y = context.maxY;
    } else {
      done = true;
    }
    this._clearTransition(done);
    if (!done) {
      var velocity2 = this._horizontal ?
        (x - this._x) :
        (y - this._y);
      velocity2 = velocity2 / 2;
      if (Math.abs(velocity2) > Math.abs(velocity)) {
        this._bounceTo(x, y, velocity2);
      } else {
        this._bounceTo(x, y, velocity);
      }
    }
  }
};

/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onOrientationChange = function() {
  this.scrollTo(0, 0);
};