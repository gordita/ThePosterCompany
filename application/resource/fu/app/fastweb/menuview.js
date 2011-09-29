goog.provide('fu.app.fastweb.MenuView');

goog.require('fu.app.fastweb.MainMenu');
goog.require('fu.app.fastweb.SearchBox');
goog.require('fu.dom.ViewportSizeMonitor');
goog.require('fu.events.EventType');
goog.require('fu.layout.Stack');
goog.require('fu.ui.BaseUI');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('tpl.fu.CSSNames');

/**
 * @constructor
 * @extends {fu.layout.Stack}
 */
fu.app.fastweb.MenuView = function() {
  goog.base(this);
  this.addCssName(tpl.fu.CSSNames.CSS_MENU_VIEW);

  /**
   * @type {fu.app.fastweb.SearchBox}
   * @private
   */
  this._searchBox = new fu.app.fastweb.SearchBox();

  /**
   * @type {fu.app.fastweb.MainMenu}
   * @private
   */
  this._mainMenu = new fu.app.fastweb.MainMenu();

  /**
   * @type {boolean}
   * @private
   */
  this._inSearchMode = false;

  this.addToHeader(this._searchBox);
  this.addToBody(this._mainMenu);
};
goog.inherits(fu.app.fastweb.MenuView, fu.layout.Stack);


/**
 * @type {number}
 * @const
 */
fu.app.fastweb.MenuView.MENU_MIN_WIDTH = 270;


/** @inheritDoc */
fu.app.fastweb.MenuView.prototype.captureEvents = function() {
  goog.base(this, 'captureEvents');

  this.getHandler().listen(
    this._searchBox,
    goog.events.EventType.FOCUS,
    this.refresh);

  this.getHandler().listen(
    this._searchBox,
    goog.events.EventType.BLUR,
    this.refresh);
};

/** @inheritDoc */
fu.app.fastweb.MenuView.prototype.refresh = function() {
  goog.base(this, 'refresh');

  var inSearchMode = this._searchBox.hasFocus();

  goog.dom.classes.enable(
    this.getElement(),
    tpl.fu.CSSNames.CSS_MENU_VIEW_IN_SEARCH,
    inSearchMode);

  this.dispatchEvent(inSearchMode ?
    fu.events.EventType.SEARCH_START :
    fu.events.EventType.SEARCH_CANCEL);
};

/**
 * @return {number}
 */
fu.ui.BaseUI.prototype.getMenuWidth = function() {
  var inSearchMode = this._searchBox.hasFocus();
  // TODO(hedger): User Child's width.
  return inSearchMode ?
    fu.dom.ViewportSizeMonitor.getInstance().getSize().width :
    fu.app.fastweb.MenuView.MENU_MIN_WIDTH;
};
