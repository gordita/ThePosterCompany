goog.provide('fu.events.EventType');

goog.require('goog.events');
goog.require('fu.env.runtime');


/**
 * Constants for event names.
 * @enum {string}
 */
fu.events.EventType = {
  CLICK : 'click',

  // Touch events
  TOUCHSTART : fu.env.runtime.USE_TOUCH ? 'touchstart' : 'mousedown',
  TOUCHEND : fu.env.runtime.USE_TOUCH ? 'touchend' : 'mouseup',
  TOUCHCANCEL : fu.env.runtime.USE_TOUCH ? 'touchcancel' : 'mouseup',
  TOUCHMOVE : fu.env.runtime.USE_TOUCH ? 'touchmove' : 'mousemove',

  // Other events
  HASHCHANGE : 'hashchange',
  POPSTATE : 'popstate',

  TRANSITIONEND : fu.env.runtime.USE_WEBKIT_TRANSITION ?
    'webkitTransitionEnd' :
    'transitionend',

  ORIENTATION_CHANGE : fu.env.runtime.USE_ORIENTATION ?
    'orientationchange' :
    'resize',

  // Custom Events.
  CLICK_HREF : goog.events.getUniqueId('clickhref'),
  CLICK_CONTENT : goog.events.getUniqueId('clickcontent'),
  LAYOUT_RESIZE : goog.events.getUniqueId('layoutresize'),
  URL_DISPATCH : goog.events.getUniqueId('urldispatch'),
  SEARCH_START : goog.events.getUniqueId('searchstart'),
  SEARCH_CANCEL : goog.events.getUniqueId('searchcancel'),
  VIEWPORT_SIZE_CHANGE : goog.events.getUniqueId('viewportchange')
};
