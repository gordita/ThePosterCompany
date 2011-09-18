goog.provide('fu.events.EventType');

goog.require('goog.events');
goog.require('fu.env.client');


/**
 * Constants for event names.
 * @enum {string}
 */
fu.events.EventType = {
  // Touch events
  TOUCHSTART : fu.env.client.USE_TOUCH ? 'touchstart' : 'mousedown',
  TOUCHEND : fu.env.client.USE_TOUCH ? 'touchend' : 'mouseup',
  TOUCHCANCEL : fu.env.client.USE_TOUCH ? 'touchcancel' : 'mouseup',
  TOUCHMOVE : fu.env.client.USE_TOUCH ? 'touchmove' : 'mousemove',

  // Other events
  TRANSITIONEND : fu.env.client.USE_WEBKIT_TRANSITION ?
    'webkitTransitionEnd' :
    'transitionend',

  ORIENTATION_CHANGE : fu.env.client.USE_ORIENTATION ?
    'orientationchange' :
    'resize',

  // Custom Events.
  LAYOUT_UPDATE : goog.events.getUniqueId('layout'),
  LOGIN : goog.events.getUniqueId('login'),
  LOGOUT : goog.events.getUniqueId('out'),
  SELECTCHANGE :  goog.events.getUniqueId('selectschange'),
  VIEWPORT_SIZE_CHANGE : goog.events.getUniqueId('viewportchange'),
  URL_UPDATE : goog.events.getUniqueId('urlupdate'),
  URL_DISPATCH : goog.events.getUniqueId('urldispatch')
};
