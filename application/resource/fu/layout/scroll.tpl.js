// This file was automatically generated from scroll.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.layout.Scroll');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.layout.Scroll.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="', CSS_LAYOUT_SCROLL, '"><div id="', soy.$$escapeHtml(opt_data.id), '_content" class="', CSS_LAYOUT_SCROLL_CONTENT, '"></div></div>');
  if (!opt_sb) return output.toString();
};
