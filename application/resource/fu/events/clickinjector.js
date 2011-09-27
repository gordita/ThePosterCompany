goog.provide('fu.events.ClickInjector');

goog.require('fu.events');
goog.require('fu.events.EventType');
goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');


/**
 * @param {Element} target
 * @extends {goog.events.EventTarget}
 * @constructor
 */
fu.events.ClickInjector = function(target) {
  goog.base(this);

  /**
   * @type {Element}
   * @private
   */
  this._target = target;

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._handler = new goog.events.EventHandler(this);

  /**
   * @type {goog.math.Rect}
   * @private
   */
  this._touchedRect = null;

  /**
   * @type {boolean}
   * @private
   */
  this._preventClick = false;

  /**
   * @type {number}
   * @private
   */
  this._touchedRectPadding = 5;

  /**
   * @type {Element}
   * @private
   */
  this._linkToClick = null;

  /**
   * @type {?string}
   * @private
   */
  this._attributeHref = null;

  /**
   * @type {?string}
   * @private
   */
  this._href = null;

  this._handler.listen(
    target,
    fu.events.EventType.TOUCHSTART,
    this._onTouchStart);

  this._handler.listen(
    target,
    fu.events.EventType.TOUCHEND,
    this._onTouchEnd);

  this._handler.listen(
    target,
    goog.events.EventType.CLICK,
    this._onClick);
};
goog.inherits(fu.events.ClickInjector, goog.events.EventTarget);


/**
 * @inheritDoc
 */
fu.events.ClickInjector.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this._handler.dispose();
};

/**
 * @private
 */
fu.events.ClickInjector.prototype._reset = function() {
  this._touchedRect = null;
  this._preventClick = false;
  this._linkToClick = null;
  this._attributeHref = null;
  this._href = null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onTouchStart = function(evt) {
  this._reset();

  var target = evt.target;
  switch (target.nodeType) {
    case goog.dom.NodeType.TEXT:
      target = target.parentNode;
      break;

    case goog.dom.NodeType.ELEMENT:
      break;

    default:
      return;
  }

  var el = /** @type {Element} */ (evt.target);
  var n = 0;
  var href = target.href;
  while (n < 6 && el && !href) {
    href = target.href;
    if (href) {
      break;
    }
    el = /** @type {Element} */ (el.parentNode);
    n++;
  }

  if (!href) {
    return;
  }

  this._href = href;
  this._linkToClick = /** @type {Element} */ (el);
  this._attributeHref = target.getAttribute('href');

  var touch = fu.events.getTouch(evt);
  var x = touch.clientX;
  var y = touch.clientY;
  var padding = this._touchedRectPadding;
  this._touchedRect = new goog.math.Rect(
    x - padding,
    y - padding,
    x + padding,
    y + padding);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onTouchEnd = function(evt) {
  if (fu.events.isPrevented(evt)) {
    this._reset();
    return;
  }

  if (this._touchedRect) {
    var touch = fu.events.getTouch(evt);
    var x = touch.clientX;
    var y = touch.clientY;
    var point = new goog.math.Coordinate(x, y);
    if (!this._touchedRect.contains(point)) {
      return;
    }
  }

  if (this._attributeHref && this._attributeHref.indexOf('#') !== 0) {
    var evt2 = new fu.events.Event(fu.events.EventType.CLICK_HREF, this);
    evt2.href = this._href;
    this.dispatchEvent(evt2);
    evt.preventDefault();
    this._preventClick = true;
  }
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onClick = function(evt) {
  if (fu.events.isPrevented(evt)) {
    this._reset();
    return;
  }

  if (this._preventClick) {
    evt.preventDefault();
  }
  this._reset();
};