goog.provide('fu.ui.scroll.Scrollable');


/**
 * @interface
 */
fu.ui.scroll.Scrollable = function() {

};

/**
 * @param {number} x
 * @param {number} y
 */
fu.ui.scroll.Scrollable.prototype.scrollTo = goog.abstractMethod;

/**
 * @param {boolean} scrollbale
 */
fu.ui.scroll.Scrollable.prototype.setScrollable = goog.abstractMethod;

/**
 * @return {number}
 */
fu.ui.scroll.Scrollable.prototype.getScrollHeight = goog.abstractMethod;

/**
 * @return {number}
 */
fu.ui.scroll.Scrollable.prototype.getScrollWidth = goog.abstractMethod;

/**
 * @return {number}
 */
fu.ui.scroll.Scrollable.prototype.getScrollLeft = goog.abstractMethod;

/**
 * @return {number}
 */
fu.ui.scroll.Scrollable.prototype.getScrollTop = goog.abstractMethod;