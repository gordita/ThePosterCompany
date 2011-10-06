goog.provide('fu.layout.Absolute');

goog.require('fu.animator.Position');
goog.require('fu.layout.BaseLayout');
goog.require('fu.events.EventType');
goog.require('goog.dispose');
goog.require('goog.dom.classes');
goog.require('goog.math.Coordinate');
goog.require('tpl.fu.layout.FullView');
goog.require('tpl.fu.CSSNames');


/**
 * @constructor
 * @extends {fu.layout.BaseLayout}
 */
fu.layout.Absolute = function() {
  goog.base(this);

  /**
   * @type {number}
   * @private
   */
  this._zIndex = 1;

  /**
   * @type {fu.animator.Position}
   * @private
   */
  this._anim = null;

  /**
   * @type {goog.math.Coordinate}
   * @private
   */
  this._position = new goog.math.Coordinate(0, 0);
};
goog.inherits(fu.layout.Absolute, fu.layout.BaseLayout);


/**
 * @type {number}
 * @private
 */
fu.layout.Absolute._zIndex = 100;


/**
 * @inheritDoc
 */
fu.layout.Absolute.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this._anim);
};

/**
 * @inheritDoc
 */
fu.layout.Absolute.prototype.prepareElement = function() {
  goog.base(this, 'prepareElement');
  goog.dom.classes.add(this.getElement(), tpl.fu.CSSNames.CSS_ABSOLUTE_LAYOUT);
};

/**
 * @inheritDoc
 */
fu.layout.Absolute.prototype.getContentElement = function() {
  return this.getElement();
};


/**
 * bringToTop
 */
fu.layout.Absolute.prototype.bringToTop = function() {
  fu.layout.Absolute._zIndex++;
  this.setZIndex(fu.layout.Absolute._zIndex);
};


/**
 * @param {goog.math.Coordinate} pos
 */
fu.layout.Absolute.prototype.setPosition = function(pos) {
  this._position = pos;
};

/**
 * @return {goog.math.Coordinate} pos
 */
fu.layout.Absolute.prototype.getPosition = function(pos) {
  return this._position;
};


/**
 *
 * @param {number} x
 * @param {number} y
 */
fu.layout.Absolute.prototype.moveTo = function(x, y) {
  goog.dispose(this._anim);
  var pos = new goog.math.Coordinate(x, y);
  if (!goog.math.Coordinate.equals(this._position, pos)) {
    this._anim = new fu.animator.Position(this.getElement(), pos);
    this._anim.play();
    this.setPosition(pos);
  }
};


/**
 * @param zIndex
 */
fu.layout.Absolute.prototype.setZIndex = function(zIndex) {
  if (this._zIndex !== zIndex) {
    this._zIndex = zIndex;
    this.getElement().style.zIndex = zIndex;
  }
};