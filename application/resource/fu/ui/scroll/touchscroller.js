goog.provide('fu.ui.scroll.TouchScroller');

goog.require('fu.animator.Positions');
goog.require('fu.env.runtime');
goog.require('fu.events');
goog.require('fu.events.EventType');
goog.require('fu.style');
goog.require('fu.ui.scroll.Scrollable');
goog.require('goog.array');
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
fu.ui.scroll.TouchScroller.MAX_VELOCITY = 1.6;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.TAU = 1 / 600;  // (1/ms)


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.ANIMATION_INTERVAL = 1000 / 25; // fps

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.ANIMATION_RURATION_DIVIDER = 1.5;


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.DECELERATE_EPSILON = 6;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.LIMIT_OFFSET = 50;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.SPRING_EPSILON = 1;


/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.OMEGA = 0.7 / 32;

/**
 * @const {number}
 */
fu.ui.scroll.TouchScroller.TRANSITION_INTERNAL = 50;

/**
 * @inheritDoc
 */
fu.ui.scroll.TouchScroller.prototype.disposeInternal = function() {
  this._handler.dispose();

  if (this._moveContext && this._moveContext.animator) {
    this._moveContext.animator.dispose();
  }

  this._stop();
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
    this._stop();
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
  if (this._x === x && this._y === y && this._initialized) {
    return;
  }

  this._x = x;
  this._y = y;
  this._translateTo(-x, -y);
};


/**
 * @param {number} x
 * @param {number} y
 */
fu.ui.scroll.TouchScroller.prototype._translateTo = function(x, y) {
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
  this._stop();

  if (fu.events.isPrevented(evt)) {
    return;
  }

  this._handler.removeAll();

  var coord = fu.events.getTouchPagePosition(evt);
  var context = this._moveContext = {};
  context.minX = 0;
  context.minY = 0;
  context.maxX = this._getMaxScrollLeft();
  context.maxY = this._getMaxScrollTop();
  context.scrolling = false;
  context.startTouchCoord = coord;
  context.pageOffsetCoord = new goog.math.Coordinate(
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

    // fu.style.removeAnimation(this._body);
    // this._translateTo(-this._x, this._y);

    context.scrolling = true;
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
  var x = this._x;
  var y = this._y;
  var bounce_to = true;

  if (context.scrolling) {
    context.scrolling = false;

    var dx = context.currentTouchCoord.x - context.lastTouchCoord.x;
    var dy = context.currentTouchCoord.y - context.lastTouchCoord.y;
    var dt = context.currentTime - context.previousTime;
    var distance = this._horizontal ? dx : dy;
    var velocity;
    if (this._snap) {
      if (this._horizontal) {
        var width = this._body.offsetWidth;
        var rx = width % this._x;
        var snap_x;
        if (rx) {
          snap_x = dx < 0 ?
            Math.ceil((context.startX + 1) / width) * width :
            Math.floor((context.startX - 1) / width) * width;
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
            Math.ceil(context.startY / height) * height :
            Math.floor(context.startY / height) * height;
          context.snapY = goog.math.clamp(
            snap_y,
            context.minY,
            context.maxY);
        } else {
          context.snapY = 0;
        }
      }
    }


    velocity = (distance / dt) || 1;
    velocity *= Math.min(
      1,
      fu.ui.scroll.TouchScroller.MAX_VELOCITY / Math.abs(velocity));

    // Do some fall off if the user holds in place after scrolling
    velocity *= Math.max(0, 1 - (dt) / 250);
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
      bounce_to = false;
      if (Math.abs(velocity) >= 1) {
        this._decelerateTo(
          this._x,
          this._y,
          -velocity);
      }
    }
    evt.preventDefault();
  } else {
    velocity = 0;
    if (this._horizontal && this._x < context.minX) {
      x = context.minX;
    } else if (this._horizontal && this._x > context.maxX) {
      x = context.maxX;
    } else if (this._y < context.minY) {
      y = context.minY;
    } else if (this._y > context.maxY) {
      y = context.maxY;
    } else {
      bounce_to = false;
    }
    this._moveContext = {};
  }

  if (bounce_to && (this._x !== x || this._y !== y)) {
    this._bounceTo(x, y, velocity);
    evt.preventDefault();
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
 * @param {number} startX
 * @param {number} startY
 * @param {number} startV
 */
fu.ui.scroll.TouchScroller.prototype._decelerateTo = function(startX, startY,
                                                              startV) {
  if (this._moveContext.animator) {
    this._moveContext.animator.dispose();
  }

  var info = this._getDecelerateToInfo(startX, startY, startV);
  var animator =
    new fu.animator.Positions(this._body, info.coords, info.duration);
  this._moveContext.animator = animator;
  animator.play();
};


/**
 * @param {number} endX
 * @param {number} endY
 * @param {number} startV
 */
fu.ui.scroll.TouchScroller.prototype._bounceTo = function(endX, endY, startV) {
  if (this._moveContext.animator) {
    this._moveContext.animator.dispose();
  }

  var info = this._getBounceToInfo(this._x, this._y, startV, endX, endY);
  var animator =
    new fu.animator.Positions(this._body, info.coords, info.duration);
  this._moveContext.animator = animator;
  animator.play();
};


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} startV
 * @return {Object}
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._getDecelerateToInfo = function(startX,
                                                                     startY,
                                                                     startV) {
  var now = goog.now();
  var startT = now;
  var coords = [];
  var interval = fu.ui.scroll.TouchScroller.ANIMATION_INTERVAL;
  var tt, yy,  bounceInfo;
  var x = startX;
  var y = startY;
  var tau = fu.ui.scroll.TouchScroller.TAU;

  if (this._horizontal) {
    alert('todo:_decelerateTo:h');
  } else {
    var minY = this._moveContext.minY;
    var minYLimit = minY - fu.ui.scroll.TouchScroller.LIMIT_OFFSET;
    var maxY = this._moveContext.maxY;
    var maxYLimit = maxY + fu.ui.scroll.TouchScroller.LIMIT_OFFSET;
    var endY = startY + startV / tau;
    while (true) {
      tt = now - startT;
      yy = startV / tau * Math.exp(-tau * tt);
      if (y < minYLimit || y > maxYLimit) {
        yy = 0;
      } else {
        y = endY - yy;
        coords.push(new goog.math.Coordinate(-x, -Math.round(y)));
      }

      if (Math.abs(yy) > fu.ui.scroll.TouchScroller.DECELERATE_EPSILON) {
        now += interval; // fps = 24.
      } else {
        if (endY < minY) {
          bounceInfo = this._getBounceToInfo(
            startX,
            y,
            (y - minY) / interval,
            startX,
            minY,
            true);
        } else if (endY > maxY) {
          bounceInfo = this._getBounceToInfo(
            startX,
            y,
            (y - maxY) / interval,
            startX,
            maxY,
            true);
        }
        break;
      }
    }
  }

  var duration = now - startT;
  if (bounceInfo) {
    coords = coords.concat(bounceInfo.coords);
    duration += (bounceInfo.duration * 5 *
      fu.ui.scroll.TouchScroller.ANIMATION_RURATION_DIVIDER);
  }

  return {
    coords : coords,
    duration:  duration / fu.ui.scroll.TouchScroller.ANIMATION_RURATION_DIVIDER
  };
};


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} startV
 * @param {number} endX
 * @param {number} endY
 * @param {boolean=} opt_double
 * @return {Object}
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._getBounceToInfo = function(startX, startY,
                                                                 startV, endX,
                                                                 endY,
                                                                 opt_double) {
  var now = goog.now();
  var interval = fu.ui.scroll.TouchScroller.ANIMATION_INTERVAL;
  var startT = now;
  var omega = fu.ui.scroll.TouchScroller.OMEGA;
  var x, y, tt;
  var coords = [];
  var coord;
  var prevCoord;
  if (this._horizontal) {
    alert('todo:_bounceTo:h');
  } else {
    var startDeltaY = endY - startY;
    x = endX;
    var yy;
    var next = true;
    while (next) {
      tt = now - startT;
      yy = (startDeltaY + (startV + startDeltaY * omega) * tt) *
        Math.exp(-omega * tt);
      if (Math.abs(yy) < fu.ui.scroll.TouchScroller.SPRING_EPSILON) {
        coord = new goog.math.Coordinate(-x, -Math.round(endY));
        next = false;
      } else {
        y = endY - yy;
        coord = new goog.math.Coordinate(-x, -Math.round(y));
        now += interval;
      }
      if (prevCoord && opt_double) {
        coords.push(new goog.math.Coordinate(coord.x, Math.round((prevCoord.y + coord.y) / 2)));
      }
      coords.push(coord);
      prevCoord = coord;
    }
  }

  var ruration = now - startT;
  return {
    coords : coords,
    duration:  ruration / 2
  };
};


/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._stop = function() {
  if (this._moveContext.animator) {
    this._moveContext.animator.dispose();
    this._moveContext.animator = null;
    var coord = fu.style.getTranslatePosition(this._body);
    this._scrollTo(-coord.x, -coord.y);
  }
};

/**
 * @private
 */
fu.ui.scroll.TouchScroller.prototype._onOrientationChange = function() {
  this.scrollTo(0, 0);
};