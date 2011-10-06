goog.provide('fu.ui.BaseUI');

goog.require('fu.dom.ViewportSizeMonitor');
goog.require('fu.id.IdGenerator');
goog.require('fu.logger');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dispose');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('tpl.fu.CSSNames');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
fu.ui.BaseUI = function() {
  goog.base(this);

  /**
   * @type {?string}
   * @private
   */
  this._id = null;

  /**
   * @type {goog.dom.DomHelper}
   * @private
   */
  this._dom = null;


  /**
   * @type {fu.ui.BaseUI}
   * @private
   */
  this._parent = null;

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._handler = null;

  /**
   * @type {Array.<fu.ui.BaseUI>}
   * @private
   */
  this._children = [];

  /**
   * @type {Element}
   * @private
   */
  this._el = null;

  /**
   * @type {boolean}
   * @private
   */
  this._rendered = false;

  /**
   * @type {boolean}
   * @private
   */
  this._visible = true;

  /**
   * @type {?boolean}
   * @private
   */
  this._eventsCaptured = null;

  /**
   * @type {?boolean}
   * @private
   */
  this._callingSetEventsCaptured = false;

  /**
   * @type {Array.<string>}
   */
  this._cssNamesToAdd = null;
};
goog.inherits(fu.ui.BaseUI, goog.events.EventTarget);


/**
 * @inheritDoc
 */
fu.ui.BaseUI.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.array.forEach(this._children, function(child) {
    (/** @type {fu.ui.BaseUI} */ (child)).dispose();
  }, this);

  this._children = null;
  goog.dispose(this._handler);
  goog.dispose(this._scrollable);
};

/**
 * @return {fu.ui.BaseUI}
 */
fu.ui.BaseUI.prototype.getParent = function() {
  return this._parent;
};


/**
 * @return {boolean}
 */
fu.ui.BaseUI.prototype.isInDocument = function() {
  if (this._el && this._dom) {
    if (this._parent) {
      return this._parent.isInDocument();
    } else {
      return this._dom.contains(this._dom.getDocument().body, this._el);
    }
  }
  return false;
};

/**
 * @return {string}
 * @protected
 */
fu.ui.BaseUI.prototype.getId = function() {
  if (!this._id) {
    this._id = fu.id.IdGenerator.next();
  }
  return this._id;
};

/**
 * @return {goog.dom.DomHelper}
 * @protected
 */
fu.ui.BaseUI.prototype.getDom = function() {
  if (!this._dom) {
    this._dom = new goog.dom.DomHelper(document);
  }
  return this._dom;
};


/**
 * @param {goog.dom.DomHelper} dom
 * @protected
 */
fu.ui.BaseUI.prototype.setDom = function(dom) {
  goog.asserts.assert(!this._dom, 'dom already set');
  this._dom = dom;
};


/**
 * @param {boolean} visible
 */
fu.ui.BaseUI.prototype.setVisible = function(visible) {
  if (this._visible == visible) {
    return;
  }
  this._visible = visible;

  // TODO
//  if (this.getElement()) {
//    goog.dom.classes.enable(
//      this.getElement(),
//      tpl.CSS_NAMES.CSS_DISPLAY_NONE,
//      !visible);
//  }
};


/**
 * @param {string} cssName
 */
fu.ui.BaseUI.prototype.addCssName = function(cssName) {
  if (!this._el) {
    if (!this._cssNamesToAdd) {
      this._cssNamesToAdd = [];
    }
    this._cssNamesToAdd.push(cssName);
  } else {
    goog.dom.classes.add(this._el, cssName);
  }
};


/**
 * @return {Element}
 */
fu.ui.BaseUI.prototype.getElement = function() {
  if (!this._el) {
    this.createElement();
  }
  return this._el;
};


/**
 * @param {string|number} suffix
 * @return {Element}
 */
fu.ui.BaseUI.prototype.getInnerElement = function(suffix) {
  var el = this.getElement();
  goog.asserts.assert(el, 'element is null');
  var selector = '#' + this.getId() + '_' + suffix;
  var node = el.querySelector(selector);
  if (!node) {
    fu.logger.log('innerElement is null', suffix, el, el.innerHTML, this);
  }
  return node;
};


/**
 * @return {Element}
 */
fu.ui.BaseUI.prototype.getContentElement = function() {
  return this.getElement();
};


/**
 * @param {Function=} opt_template
 * @protected
 */
fu.ui.BaseUI.prototype.createElement = function(opt_template) {
  goog.asserts.assert(!this._el, 'element already created');
  var el = this.getDom().createElement('div');
  var payload = this.createPayload();
  el.innerHTML = opt_template ?
    String(opt_template(payload)) :
    this.createTemplate(payload);
  this._el = this.getDom().getFirstElementChild(el);
};


/**
 * @return {Object}
 * @protected
 */
fu.ui.BaseUI.prototype.createPayload = function() {
  return {
    id : this.getId()
  };
};

/**
 * @param {Object} payload
 * @return {string|undefined}
 * @protected
 */
fu.ui.BaseUI.prototype.createTemplate = function(payload) {
  return '<div id="' + this.getId() + '"></div>';
};


/**
 * @return {goog.events.EventHandler}
 */
fu.ui.BaseUI.prototype.getHandler = function() {
  if (!this._handler) {
    this._handler = new goog.events.EventHandler(this);
  }
  return this._handler;
};


/**
 * @param {Element} parentEl
 */
fu.ui.BaseUI.prototype.render = function(parentEl) {
  goog.asserts.assert(!this._rendered, 'UI already rendered');
  this._rendered = true;

  var doc = goog.dom.getOwnerDocument(parentEl);
  if (!this._dom) {
    var dom = new goog.dom.DomHelper(doc);
    this.setDom(dom);
  }

  parentEl.appendChild(this.getElement());

  if (this._cssNamesToAdd) {
    this.getElement().className += ' ' + this._cssNamesToAdd.join(' ');
    this._cssNamesToAdd = null;
  }

  var contentEl = this.getContentElement();
  goog.array.forEach(this._children, function(child) {
    if (!child._rendered) {
      // Check rendered to avoid assertion error.
      child.render(contentEl);
    } else {
      child._enterDocument();
    }
  }, this);
  contentEl = null;

  if (this.isInDocument()) {
    this._enterDocument();
  }
};

/**
 * @param {fu.ui.BaseUI} child
 */
fu.ui.BaseUI.prototype.addChild = function(child) {
  goog.asserts.assert(!child._parent, 'Child already has parent');
  child._parent = this;
  child.setParentEventTarget(this);
  this._children.push(child);
  if (this._rendered) {
    child.render(this.getContentElement())
  }
};

/**
 * @param {boolean} captured
 * @protected
 */
fu.ui.BaseUI.prototype.setEventsCaptured = function(captured) {
  if (this._eventsCaptured === captured) {
    return;
  }
  this._eventsCaptured = captured;
  goog.array.forEach(this._children, function(child) {
    child.setEventsCaptured(captured);
  }, this);

  this._callingSetEventsCaptured = true;
  if (captured) {
    // Check rendered to avoid assertion error.
    this.captureEvents();
  } else {
    this.releaseEvents();
  }
  this._callingSetEventsCaptured = false;
};

/**
 * @param {fu.ui.BaseUI} child
 * @param {...Function} var_args
 * @protected
 */
fu.ui.BaseUI.prototype.assertChildTypes = function(child, var_args) {
  if (!COMPILED) {
    var pass = goog.array.some(arguments, function(type, i) {
      if (i > 0 && child instanceof type) {
        return true;
      }
    });
    goog.asserts.assert(pass, 'Invalid Child Type');
  }
};

/**
 * @private
 */
fu.ui.BaseUI.prototype._enterDocument = function() {
  this.prepareElement();
  this.setEventsCaptured(true);
  this.refresh();
};


/**
 * Add more elements, changing className...etc.
 * @protected
 */
fu.ui.BaseUI.prototype.prepareElement = goog.nullFunction;

/**
 * @protected
 */
fu.ui.BaseUI.prototype.captureEvents = function() {
  goog.asserts.assert(
    this._callingSetEventsCaptured,
    'captureEvents must called by setEventsCaptured');
};


/**
 * @protected
 */
fu.ui.BaseUI.prototype.releaseEvents = function() {
  goog.asserts.assert(
    this._callingSetEventsCaptured,
    'releaseEvents must called by setEventsCaptured');

  if (this._handler) {
    this._handler.removeAll();
  }
};


/**
 * @protected
 */
fu.ui.BaseUI.prototype.refresh = goog.nullFunction;