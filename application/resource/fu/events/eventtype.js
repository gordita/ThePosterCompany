goog.provide('fu.events.EventType');

goog.require('goog.events');
goog.require('fu.env.runtime');


/**
 * Constants for event names.
 * @enum {string}
 */
fu.events.EventType = {
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
  CLICK_HREF : goog.events.getUniqueId('href'),
  LAYOUT_UPDATE : goog.events.getUniqueId('layout'),
  LOGIN : goog.events.getUniqueId('login'),
  LOGOUT : goog.events.getUniqueId('out'),
  SELECTCHANGE :  goog.events.getUniqueId('selectschange'),
  VIEWPORT_SIZE_CHANGE : goog.events.getUniqueId('viewportchange'),
  URL_UPDATE : goog.events.getUniqueId('urlupdate'),
  URL_DISPATCH : goog.events.getUniqueId('urldispatch')
};
