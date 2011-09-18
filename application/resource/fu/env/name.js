goog.provide('fu.env.name');

goog.require('fu.env.client');

/**
 * @const {string}
 */
fu.env.name.STYLE_UNKNOWN = 'unknown';

/**
 * @const {string}
 */
fu.env.name.STYLE_TRANSFORM = fu.env.client.USE_WEBKIT_TRANSITION ?
  'webkitTransform' :
  fu.env.name.STYLE_UNKNOWN;

/**
 * @const {string}
 */
fu.env.name.STYLE_TRANSFORM_CSS_TEXT = fu.env.client.USE_WEBKIT_TRANSITION ?
  '-webkit-transform' :
  fu.env.name.STYLE_UNKNOWN;


/**
 * @const {string}
 */
fu.env.name.STYLE_TRANSITION = fu.env.client.USE_WEBKIT_TRANSITION ?
  'webkitTransition' :
  fu.env.name.STYLE_UNKNOWN;
