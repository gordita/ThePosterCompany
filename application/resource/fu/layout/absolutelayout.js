goog.provide('fu.layout.AbsoluteLayout');

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
fu.layout.AbsoluteLayout = function() {
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
goog.inherits(fu.layout.AbsoluteLayout, fu.layout.BaseLayout);


/**
 * @type {number}
 * @private
 */
fu.layout.AbsoluteLayout._zIndex = 100;


/**
 * @inheritDoc
 */
fu.layout.AbsoluteLayout.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this._anim);
};

/**
 * @inheritDoc
 */
fu.layout.AbsoluteLayout.prototype.prepareElement = function() {
  goog.base(this, 'prepareElement');
  goog.dom.classes.add(this.getElement(), tpl.fu.CSSNames.CSS_ABSOLUTE_LAYOUT);
};


/**
 * bringToTop
 */
fu.layout.AbsoluteLayout.prototype.bringToTop = function() {
  fu.layout.AbsoluteLayout._zIndex++;
  this.setZIndex(fu.layout.AbsoluteLayout._zIndex);
};


/**
 * @param {goog.math.Coordinate} pos
 */
fu.layout.AbsoluteLayout.prototype.setPosition = function(pos) {
  this._position = pos;
};

/**
 * @return {goog.math.Coordinate} pos
 */
fu.layout.AbsoluteLayout.prototype.getPosition = function(pos) {
  return this._position;
};


/**
 *
 * @param {number} x
 * @param {number} y
 */
fu.layout.AbsoluteLayout.prototype.moveTo = function(x, y) {
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
fu.layout.AbsoluteLayout.prototype.setZIndex = function(zIndex) {
  if (this._zIndex !== zIndex) {
    this._zIndex = zIndex;
    this.getElement().style.zIndex = zIndex;
  }
};