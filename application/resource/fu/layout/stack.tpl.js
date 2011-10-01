// This file was automatically generated from stack.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.layout.Stack');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.layout.Stack.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="', CSS_STACK_LAYOUT, '"></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.layout.Stack.head = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_STACK_LAYOUT_HEAD, '"><div id="', soy.$$escapeHtml(opt_data.id), '_content" class="', CSS_STACK_LAYOUT_CONTENT, '"></div></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.layout.Stack.body = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_STACK_LAYOUT_BODY, '"><div id="', soy.$$escapeHtml(opt_data.id), '_content" class="', CSS_STACK_LAYOUT_CONTENT, '"></div></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.layout.Stack.foot = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_STACK_LAYOUT_FOOT, '"><div id="', soy.$$escapeHtml(opt_data.id), '_content" class="', CSS_STACK_LAYOUT_CONTENT, '"></div></div>');
  if (!opt_sb) return output.toString();
};
