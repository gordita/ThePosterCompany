// This file was automatically generated from searchbox.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.app.fastweb.SearchBox');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.SearchBox.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="', CSS_SEARCH_BOX, '"><div class="', CSS_SEARCH_BOX_INPUT_WRAP, '"><div id="', soy.$$escapeHtml(opt_data.id), '_input" tabindex="1" role="button" class="', CSS_SEARCH_BOX_INPUT, '">Search</div></div><div class="', CSS_SEARCH_BOX_BUTTON_WRAP, '"><div id="', soy.$$escapeHtml(opt_data.id), '_button" tabindex="1" role="button" class="', CSS_SEARCH_BOX_BUTTON, '">Cancel</div></div></div>');
  if (!opt_sb) return output.toString();
};
