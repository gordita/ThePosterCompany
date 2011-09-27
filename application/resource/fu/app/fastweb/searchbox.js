goog.provide('fu.app.fastweb.SearchBox');

goog.require('fu.events.EventType');
goog.require('fu.ui.BaseUI');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.SearchBox');


/**
 * @constructor
 * @extends {fu.ui.BaseUI}
 */
fu.app.fastweb.SearchBox = function() {
  goog.base(this);
  /**
   * @type {boolean}
   * @private
   */
  this._focused = false;
};
goog.inherits(fu.app.fastweb.SearchBox, fu.ui.BaseUI);

/** @inheritDoc */
fu.app.fastweb.SearchBox.prototype.createTemplate = function(payload) {
  return tpl.fu.app.fastweb.SearchBox.element(payload);
};

/** @inheritDoc */
fu.app.fastweb.SearchBox.prototype.captureEvents = function() {
  goog.base(this, 'captureEvents');

  this.getHandler().listen(
    this.getInnerElement('input'),
    fu.events.EventType.TOUCHSTART,
    this._onFocus);

  this.getHandler().listen(
    this.getInnerElement('button'),
    fu.events.EventType.TOUCHSTART,
    this._onBlur);
};

/**
 * @return {boolean}
 */
fu.app.fastweb.SearchBox.prototype.hasFocus = function() {
  return this._focused;
};


/**
 * @param {Event} evt
 * @private
 */
fu.app.fastweb.SearchBox.prototype._onFocus = function(evt) {
  if (this._focused) {
    return;
  }
  evt.preventDefault();
  this._focused = true;
  goog.dom.classes.add(
    this.getElement(),
    tpl.fu.CSSNames.CSS_SEARCH_BOX_IN_SEARCH);
  this.dispatchEvent(goog.events.EventType.FOCUS);
};

/**
 * @param {Event} evt
 * @private
 */
fu.app.fastweb.SearchBox.prototype._onBlur = function(evt) {
  if (!this._focused) {
    return;
  }
  evt.preventDefault();
  this._focused = false;
  goog.dom.classes.remove(
    this.getElement(),
    tpl.fu.CSSNames.CSS_SEARCH_BOX_IN_SEARCH);
  this.dispatchEvent(goog.events.EventType.BLUR);
};