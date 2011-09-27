goog.provide('fu.app.fastweb.Chrome');

goog.require('fu.app.fastweb.MainView');
goog.require('fu.app.fastweb.MenuView');
goog.require('fu.app.fastweb.UrlMap');
goog.require('fu.events.ClickInjector');
goog.require('fu.url.Dispatcher');
goog.require('fu.url.Navigator');
goog.require('fu.events.EventType');
goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.events.EventHandler');


/**
 * @constructor
 */
fu.app.fastweb.Chrome = function() {
  /**
   * @type {goog.dom.DomHelper}
   * @private
   */
  this._dom = new goog.dom.DomHelper(document);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this._handler = new goog.events.EventHandler(this);

  /**
   * @type {fu.app.fastweb.MainView}
   * @private
   */
  this._mainView = new fu.app.fastweb.MainView();

  /**
   * @type {fu.app.fastweb.MenuView}
   * @private
   */
  this._menuView = new fu.app.fastweb.MenuView();

  /**
   * @type {fu.events.ClickInjector}
   * @private
   */
  this._clickInjector = new fu.events.ClickInjector(
    this._dom.getDocument().body);

  /**
   * @type {fu.url.Navigator}
   * @private
   */
  this._navigator = new fu.url.Navigator(this._dom.getWindow());

  /**
   * @type {fu.url.Dispatcher}
   * @private
   */
  this._dispatcher = new fu.url.Dispatcher(this._dom.getWindow());

  /**
   * @type {boolean}
   * @private
   */
  this._showMenu = false;

  this._start();
};


/**
 * @private
 */
fu.app.fastweb.Chrome.prototype._start = function() {
  var body = this._dom.getDocument().body;
  this._mainView.render(body);
  this._menuView.render(body);
  this._mainView.bringToTop();

  this._bindEvents();
  this._registerUrls();
};


/**
 * @private
 */
fu.app.fastweb.Chrome.prototype._registerUrls = function() {
  goog.array.forEach(fu.app.fastweb.UrlMap.Urls, function(data) {
    var name = /** @type {string} */ (data[1]);
    var reg = /** @type {RegExp} */ (data[0]);
    this._dispatcher.register(name, reg);
  }, this);

  this._dispatcher.startWatch();
};


/**
 * @private
 */
fu.app.fastweb.Chrome.prototype._bindEvents = function() {
  this._handler.listen(
    this._clickInjector,
    fu.events.EventType.CLICK_HREF,
    this._onClickHref);

  this._handler.listen(
    this._dispatcher,
    fu.events.EventType.URL_DISPATCH,
    this._onUriDispatch);

  this._handler.listen(
    this._menuView,
    fu.events.EventType.SEARCH_START,
    this._updateViews);

  this._handler.listen(
    this._menuView,
    fu.events.EventType.SEARCH_CANCEL,
    this._updateViews);
};


/**
 * @param {fu.events.Event} evt
 * @private
 */
fu.app.fastweb.Chrome.prototype._onClickHref = function(evt) {
  this._navigator.go(evt.href);
  this._dispatcher.check();
};


/**
 * @param {fu.events.Event} evt
 * @private
 */
fu.app.fastweb.Chrome.prototype._onUriDispatch = function(evt) {
  var openMainView = false;
  switch (evt.name) {
    case fu.app.fastweb.UrlMap.Action.SIDE_MENU:
      this._showMenu = !this._showMenu;
      break;

    default:
      break;
  }

  this._updateViews();
};

/**
 * @private
 */
fu.app.fastweb.Chrome.prototype._updateViews = function() {
  if (this._showMenu) {
    this._mainView.moveTo(this._menuView.getMenuWidth(), 0);
  } else {
    this._mainView.moveTo(0, 0);
  }
};
