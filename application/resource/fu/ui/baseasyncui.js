goog.provide('fu.ui.BaseAsyncUI');

goog.require('fbapi');
goog.require('fu.ui.BaseUI');
goog.require('goog.asserts');

/**
 * @extends {fu.ui.BaseUI}
 * @constructor
 */
fu.ui.BaseAsyncUI = function() {
  goog.base(this);
};
goog.inherits(fu.ui.BaseAsyncUI, fu.ui.BaseUI);


/** @override */
fu.ui.BaseAsyncUI.prototype.prepareElement = function() {
  goog.base(this, 'prepareElement');
  var data = this.getAsyncData();
  data.then(
    goog.bind(this._onSuccess, this),
    goog.bind(this._onError, this)
  );
};

/**
 * @param {Object} response
 * @return {Object}
 * @protected
 */
fu.ui.BaseAsyncUI.prototype.createAsyncPayload = function(response) {
  var payload = this.createPayload();
  goog.object.forEach(payload, function(value, key) {
    goog.asserts.assert(!response[key], 'response already has key ' + key);
    response[key] = value;
  });
  response.accessToken = fbapi.getAccessToken();
  return response;
};


/**
 * @return {Element}
 */
fu.ui.BaseAsyncUI.prototype.getAsyncContentElement = function() {
  return this.getContentElement();
};

/**
 * @param {Object} response
 * @protected
 */
fu.ui.BaseAsyncUI.prototype.isDataEmpty = function(response) {
  return false;
};


/**
 * @param {Object} response
 */
fu.ui.BaseAsyncUI.prototype._onSuccess = function(response) {
  var el = this.getDom().createElement('div');
  var payload = this.createAsyncPayload(response);

  if (this.isDataEmpty(response)) {
    el.innerHTML = this.createAsyncEmptyTemplate(payload);
  } else {
    el.innerHTML = this.createAsyncTemplate(payload);
  }

  var childEl = this.getDom().getFirstElementChild(el);
  goog.asserts.assert(childEl && childEl.tagName, 'Child must be an element');
  this.getAsyncContentElement().appendChild(childEl);
};

/**
 * @param {Object} response
 */
fu.ui.BaseAsyncUI.prototype._onError = function(response) {
  var el = this.getDom().createElement('div');
  var payload = this.createAsyncPayload(response);
  el.innerHTML = this.createAsyncTemplate(payload);
  this.getAsyncContentElement().appendChild(
    this.getDom().getFirstElementChild(el));
};

/**
 * @param {Object} payload
 * @return {string|undefined}
 * @protected
 */
fu.ui.BaseAsyncUI.prototype.createAsyncEmptyTemplate = function(payload) {
  return 'empty';
};

/**
 * @param {Object} payload
 * @return {string|undefined}
 * @protected
 */
fu.ui.BaseAsyncUI.prototype.createAsyncErrorTemplate = function(payload) {
  return 'error';
};


/**
 * @return {fu.async.Callback}
 */
fu.ui.BaseAsyncUI.prototype.getAsyncData = goog.abstractMethod;


/**
 * @param {Object} payload
 * @return {string|undefined}
 * @protected
 */
fu.ui.BaseAsyncUI.prototype.createAsyncTemplate = goog.abstractMethod;
