// This file was automatically generated from topbar.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.app.fastweb.TopBar');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.TopBar.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="', CSS_TOP_BAR, '"><div class="', CSS_GROUP_START, '"><a href="/menu" class="', CSS_TOP_BAR_ICON_MENU, '">menu</a></div><div class="', CSS_GROUP_MIDDLE, '"><a href="/requests" class="', CSS_TOP_BAR_ICON_REQUESTS, '">friend requests</a><a href="/inbox" class="', CSS_TOP_BAR_ICON_INBOX, '">inbox</a><a href="/notifications" class="', CSS_TOP_BAR_ICON_NOTIFICATIONS, '">notifications</a></div><div class="', CSS_GROUP_END, '"><div id="', soy.$$escapeHtml(opt_data.id), '_contextMenuButtonContainer"></div></div></div>');
  if (!opt_sb) return output.toString();
};
