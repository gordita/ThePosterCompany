goog.provide('fu.events.ClickInjector');

goog.require('fu.async.Later');
goog.require('fu.events');
goog.require('fu.events.EventType');
goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('tpl.fu.CSSNames');


/**
 * @param {Element} target
 * @extends {goog.events.EventTarget}
 * @constructor
 */
fu.events.ClickInjector = function(target) {
  goog.base(this);

  target.tabIndex = -1;

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
   * @type {fu.async.Later}
   * @private
   */
  this._later = new fu.async.Later(this);

  /**
   * @type {boolean}
   * @private
   */
  this._moved = false;

  /**
   * @private
   * @type {goog.dom.DomHelper}
   */
  this._dom = new goog.dom.DomHelper(goog.dom.getOwnerDocument(target));

  /**
   * @private
   * @type {goog.math.Coordinate}
   */
  this._touchedPoint = null;

  /**
   * @type {?string}
   * @private
   */
  this._href = null;

  /**
   * @type {Element}
   * @private
   */
  this._mask = null;

  this._handler.listen(
    this._target,
    fu.events.EventType.TOUCHSTART,
    this._onTouchStart);

  this._handler.listen(
    this._target,
    fu.events.EventType.TOUCHMOVE,
    this._onTouchMove);

  this._handler.listen(
    this._target,
    fu.events.EventType.TOUCHEND,
    this._onTouchEnd);

  this._handler.listen(
    this._target,
    goog.events.EventType.CLICK,
    this._onClick);

  this._reset();
};
goog.inherits(fu.events.ClickInjector, goog.events.EventTarget);

/**
 * @type {number}
 * @private
 */
fu.events.ClickInjector._CLICK_DELAY = 800;


/**
 * @inheritDoc
 */
fu.events.ClickInjector.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this._reset();
  this._handler.dispose();
  this._later.dispose();
};


/**
 * @private
 * @param {boolean} pressed
 */
fu.events.ClickInjector.prototype._setPressed = function(pressed) {
  if (this._linkToClick) {
    goog.dom.classes.enable(
      this._linkToClick,
      tpl.fu.CSSNames.CSS_PRESSED,
      pressed);
  }
};


/**
 * @private
 */
fu.events.ClickInjector.prototype._reset = function() {
  if (this._linkToClick) {
    if (this._attributeHref) {
      this._linkToClick.setAttribute('href', this._attributeHref);
    }
    this._setPressed(false);
  }
  goog.dom.removeNode(this._mask);

  this._later.clearAll();
  this._linkToClick = null;
  this._attributeHref = null;
  this._touchedNode = null;
  this._href = null;
  this._moved = false;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onTouchStart = function(evt) {
  this._reset();
  this._touchedNode = evt.target;
  this._linkToClick = this._getTouchedLink(evt);
  this._touchedPoint = fu.events.getTouchPagePosition(evt);
  this._later.schedule(this._setPressed, 100, true);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onTouchMove = function(evt) {
  if (!this._moved) {
    this._moved = true;
    // this._setPressed(false);
  }
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onTouchEnd = function(evt) {
  evt.preventDefault();

  if (this._linkToClick) {
    this._href = this._linkToClick.href;
    this._attributeHref = this._linkToClick.getAttribute('href');
    this._linkToClick.removeAttribute('href');

    if (this._linkToClick.getAttribute('cmd') == 'toggle') {
      var uri = new goog.Uri(this._href);
      uri.setParameterValue('toggle', goog.now());
      this._href = uri.toString();
    }

    if (!this._moved && this._touchedNode == evt.target) {
      this._later.clearAll();
      this._setPressed(true);
      var clickEvt = new fu.events.Event(fu.events.EventType.CLICK_HREF, this);
      clickEvt.href = this._href;
      this._later.schedule(this._setPressed, 1, false);
      this._later.schedule(this.dispatchEvent, 100, clickEvt);
    } else if (this._moved) {
      this._later.clearAll();
      this._setPressed(false);
    }
  } else if (!this._moved) {
    // this._mask = this._dom.createDom('div', tpl.fu.CSSNames.CSS_CLICK_MASK);
    // goog.dom.insertChildAt(this._target, this._mask, 0);
    this._later.clearAll();
    this._setPressed(false);
    this.dispatchEvent(fu.events.EventType.CLICK_CONTENT);
  }

  this._resetLater();
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
fu.events.ClickInjector.prototype._onClick = function(evt) {
  evt.preventDefault();
  this._resetLater();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @return {Element}
 * @private
 */
fu.events.ClickInjector.prototype._getTouchedLink = function(evt) {
  var n = 0;
  var node = /** @type {Element} */ (evt.target);

  while (n < 8 && node) {
    switch (node.tagName) {
      case goog.dom.TagName.INPUT:
      case goog.dom.TagName.BUTTON:
      case goog.dom.TagName.SELECT:
        return null;
      case goog.dom.TagName.A:
        return /** @type {Element} */ node;
    }
    node = /** @type {Element} */ (node.parentNode);
    n++;
  }
  return null;
};

/**
 * @private
 */
fu.events.ClickInjector.prototype._resetLater = function() {
  this._later.schedule(this._reset, fu.events.ClickInjector._CLICK_DELAY);
};