// This file was automatically generated from menuview.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.app.fastweb.MenuView');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MenuView.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '"></div>');
  if (!opt_sb) return output.toString();
};
