goog.provide('fu.dom.ViewportSizeMonitor');


goog.require('fu.env.runtime');
goog.require('fu.events.Event');
goog.require('fu.events.EventType');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');


/**
 * @param {Window=} opt_win
 * @extends {goog.events.EventTarget}
 * @constructor
 */
fu.dom.ViewportSizeMonitor = function(opt_win) {
  goog.base(this);
  this._handler = new goog.events.EventHandler(this);

  this._window = opt_win || window;

  this._handler.listen(
    this._window, [
      goog.events.EventType.RESIZE,
      fu.events.EventType.ORIENTATION_CHANGE
    ],
    this._onResize);

  this._onResizeInternal();

  this._intreval = this._window.setInterval(
    goog.bind(this._onResizeInternal, this),
    1500);
};
goog.inherits(fu.dom.ViewportSizeMonitor, goog.events.EventTarget);
goog.addSingletonGetter(fu.dom.ViewportSizeMonitor);

/**
 * @type {Window}
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._window = null;


/**
 * @type {goog.math.Size}
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._size = null;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._handler = null;


/**
 * @type {number}
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._intreval = 0;

/**
 * @type {number}
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._timeout = 0;


/**
 * @inheritDoc
 */
fu.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this._window.clearInterval(this._intreval);
  this._window.clearTimeout(this._timeout);
  this._handler.dispose();
  this._handler = null;
};


/**
 * hideAddressBar
 */
fu.dom.ViewportSizeMonitor.prototype.hideAddressBar = function() {
  if (fu.env.runtime.ENABLE_HIDE_ADDRESSBAR) {
    if (window.pageYOffset < 1) {
      window.scrollTo(0, 1);
      this._timeout = this._window.setTimeout(
        goog.bind(this._onResizeInternal, this),
        100);
    }
  }
};


/**
 * @return {goog.math.Size}
 */
fu.dom.ViewportSizeMonitor.prototype.getSize = function() {
  var w = this._window['innerWidth'];
  var h = this._window['innerHeight'];
  var size = new goog.math.Size(w, h);
  this._size = size;
  return this._size.clone();
};


/**
 * @param {Event=} evt
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._onResize = function(evt) {
  if (evt && evt.type == fu.events.EventType.ORIENTATION_CHANGE) {
    this.hideAddressBar();
  } else {
    this._onResizeInternal();
  }
};


/**
 * @private
 */
fu.dom.ViewportSizeMonitor.prototype._onResizeInternal = function() {
  var w = this._window['innerWidth'];
  var h = this._window['innerHeight'];
  if (this._size && this._size.width === w && this._size.height === h) {
    return;
  }
  var size = new goog.math.Size(w, h);
  this._size = size;
  var evt = new fu.events.Event(fu.events.EventType.VIEWPORT_SIZE_CHANGE, this);
  evt.size = size.clone();
  this.dispatchEvent(evt);
};
