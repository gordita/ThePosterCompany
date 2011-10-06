goog.provide('fu.layout.Layers');
goog.provide('fu.layout.Layer');

goog.require('fu.layout.Absolute');
goog.require('fu.layout.BaseLayout');
goog.require('fu.ui.BaseUI');
goog.require('tpl.fu.CSSNames');


/**
 * @constructor
 * @extends {fu.layout.BaseLayout}
 */
fu.layout.Layers = function() {
  goog.base(this);
  this.addCssName(tpl.fu.CSSNames.CSS_LAYOUT_LAYERS);

  /**
   * @type {Array.<fu.layout.Layer>}
   * @private
   */
  this._layers = [];
};
goog.inherits(fu.layout.Layers, fu.layout.BaseLayout);

/**
 * @param {fu.ui.BaseUI} content
 */
fu.layout.Layers.prototype.addLayerContent = function(content) {
  var layer = new fu.layout.Layer();
  layer.addChild(content);
  this.addChild(layer);
  this._layers.push(layer);
};

/**
 * @inheritDoc
 */
fu.layout.Layers.prototype.addChild = function(child) {
  this.assertChildTypes(child, fu.layout.Layer);
  goog.base(this, 'addChild', child);
};


/**
 * @constructor
 * @extends {fu.layout.Absolute}
 */
fu.layout.Layer = function() {
  goog.base(this);
  this.addCssName(tpl.fu.CSSNames.CSS_LAYOUT_LAYER);
};
goog.inherits(fu.layout.Layer, fu.layout.Absolute);