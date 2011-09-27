goog.provide('fu.layout.Stack');
goog.provide('fu.layout.StackHead');
goog.provide('fu.layout.StackBody');
goog.provide('fu.layout.StackFoot');

goog.require('fu.layout.FullView');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.layout.Stack');


/**
 * @constructor
 * @extends {fu.layout.FullView}
 */
fu.layout.Stack = function() {
  goog.base(this);

  /**
   * @type {fu.ui.BaseUI}
   * @private
   */
  this._head = new fu.layout.Stack.Head();


  /**
   * @type {fu.ui.BaseUI}
   * @private
   */
  this._body = new fu.layout.Stack.Body();

  /**
   * @type {fu.ui.BaseUI}
   * @private
   */
  this._foot = new fu.layout.Stack.Foot();

  this.addChild(this._head);
  this.addChild(this._body);
  this.addChild(this._foot);
};
goog.inherits(fu.layout.Stack, fu.layout.FullView);

/** @inheritDoc */
fu.layout.Stack.prototype.addChild = function(child) {
  this.assertChildTypes(child,
    fu.layout.Stack.Head,
    fu.layout.Stack.Body,
    fu.layout.Stack.Foot);
  goog.base(this, 'addChild', child);
};


/** @inheritDoc */
fu.layout.Stack.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.Stack.element(payload);
};


/**
 * @param {fu.ui.BaseUI} child
 */
fu.layout.Stack.prototype.addToHeader = function(child) {
  this._head.addChild(child);
};


/**
 * @param {fu.ui.BaseUI} child
 */
fu.layout.Stack.prototype.addToBody = function(child) {
  this._body.addChild(child);
};

/**
 * @param {fu.ui.BaseUI} child
 */
fu.layout.Stack.prototype.addToFooter = function(child) {
  this._foot.addChild(child);
};

/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.layout.Stack.Head = function Head() {
  goog.base(this);
};
goog.inherits(fu.layout.Stack.Head, fu.ui.BaseUI);


/** @inheritDoc */
fu.layout.Stack.Head.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.Stack.head(payload);
};

/** @inheritDoc */
fu.layout.Stack.Head.prototype.getContentElement = function() {
  return this.getInnerElement('content');
};


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.layout.Stack.Body = function Body() {
  goog.base(this);
};
goog.inherits(fu.layout.Stack.Body, fu.ui.BaseUI);


/** @inheritDoc */
fu.layout.Stack.Body.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.Stack.body(payload);
};

/** @inheritDoc */
fu.layout.Stack.Body.prototype.getContentElement = function() {
  return this.getInnerElement('content');
};


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.layout.Stack.Foot = function Foot() {
  goog.base(this);
};
goog.inherits(fu.layout.Stack.Foot, fu.ui.BaseUI);


/** @inheritDoc */
fu.layout.Stack.Foot.prototype.createTemplate = function(payload) {
  return tpl.fu.layout.Stack.foot(payload);
};

/** @inheritDoc */
fu.layout.Stack.Foot.prototype.getContentElement = function() {
  return this.getInnerElement('content');
};