goog.provide('fu.env.client');

goog.require('fu.env.define');

/**
 * @const
 * @type {string}
 * @private
 */
fu.env.client._uaString = window.navigator.userAgent;

/**
 * @type {CSSStyleDeclaration}
 * @private
 */
fu.env.client._domStyle = document.body.style;

/**
 * @const
 * @type {boolean}
 */
fu.env.client.USE_TOUCH = fu.env.define.IS_TOUCH_DEVICE ||
  ('ontouchstart' in document);

/**
 * @const
 * @type {boolean}
 */
fu.env.client.USE_ORIENTATION = fu.env.define.IS_TOUCH_DEVICE ||
  ('orientation' in window);

/**
 * @const
 * @type {boolean}
 */
fu.env.client.USE_WEBKIT_CSS3D = fu.env.define.USE_WEBKIT_CSS3D ||
  !!(('styleMedia' in window) &&
    window['styleMedia']['matchMedium']('(-webkit-transform-3d)'));
/**
 * @const
 * @type {boolean}
 */
fu.env.client.USE_WEBKIT_CSS2D = fu.env.define.USE_WEBKIT_CSS2D ||
  !!(('styleMedia' in window) &&
    window['styleMedia']['matchMedium']('(-webkit-transform-2d)'));

/**
 * @const
 * @type {boolean}
 */
fu.env.client.USE_WEBKIT_TRANSITION = fu.env.define.USE_WEBKIT_TRANSITION ||
  ('webkitTransition' in fu.env.client._domStyle);

/**
 * @const
 * @type {boolean}
 */
fu.env.client.IS_IOS = fu.env.define.IS_IOS ||
  (/iphone|ipad|ipod/ig).test(fu.env.client._uaString);


/**
 * @const
 * @type {boolean}
 */
fu.env.client.ENABLE_HIDE_ADDRESSBAR = fu.env.define.ENABLE_HIDE_ADDRESSBAR ||
  fu.env.client.IS_IOS;