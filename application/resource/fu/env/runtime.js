goog.provide('fu.env.runtime');

goog.require('fu.env.define');

/**
 * @const
 * @type {string}
 * @private
 */
fu.env.runtime._uaString = window.navigator.userAgent;

/**
 * @type {CSSStyleDeclaration}
 * @private
 */
fu.env.runtime._domStyle = document.body.style;


/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_HISTORY_PUSH_STATE = true;


/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_TOUCH = fu.env.define.IS_TOUCH_DEVICE ||
  ('ontouchstart' in document);

/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_ORIENTATION = fu.env.define.IS_TOUCH_DEVICE ||
  ('orientation' in window);

/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_WEBKIT_CSS3D = fu.env.define.USE_WEBKIT_CSS3D ||
  !!(('styleMedia' in window) &&
    window['styleMedia']['matchMedium']('(-webkit-transform-3d)'));
/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_WEBKIT_CSS2D = fu.env.define.USE_WEBKIT_CSS2D ||
  !!(('styleMedia' in window) &&
    window['styleMedia']['matchMedium']('(-webkit-transform-2d)'));

/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.USE_WEBKIT_TRANSITION = fu.env.define.USE_WEBKIT_TRANSITION ||
  ('webkitTransition' in fu.env.runtime._domStyle);

/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.IS_IOS = fu.env.define.IS_IOS ||
  (/iphone|ipad|ipod/ig).test(fu.env.runtime._uaString);


/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.ENABLE_HIDE_ADDRESSBAR = fu.env.define.ENABLE_HIDE_ADDRESSBAR ||
  fu.env.runtime.IS_IOS;

/**
 * @const
 * @type {boolean}
 */
fu.env.runtime.ENABLE_LOGGER = fu.env.define.ENABLE_LOGGER ||
  !!window['console'];