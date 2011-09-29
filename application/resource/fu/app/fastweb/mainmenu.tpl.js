// This file was automatically generated from mainmenu.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.app.fastweb.MainMenu');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.element = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="CSS_MAIN_MENU">');
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Favorites'}, output);
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Groups'}, output);
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Lists'}, output);
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Apps'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/acount_settings', text: 'Account Settings'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/privacy_settings', text: 'Privacy Settings'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/report_bug', text: 'Report a Bug'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/log_out', text: 'Log Out'}, output);
  output.append('<div class="CSS_MAIN_MENU_FOOTER CSS_MAIN_MENU_ITEM"><a href="#" class="CSS_LINK">English(US)</a> &#183; <a href="#" class="CSS_LINK">Help</a> &#183; <a href="#" class="CSS_LINK">Desktop Site</a> &#183; <b><a href="#" class="CSS_LINK">Facebook &copy; 2011</a></b></div></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.caption = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="CSS_MAIN_MENU_CAPTION CSS_MAIN_MENU_ITEM">', soy.$$escapeHtml(opt_data.text), '</div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.link_item = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<a href="', soy.$$escapeHtml(opt_data.href), '" class="CSS_MAIN_MENU_LINK_ITEM  CSS_MAIN_MENU_ITEM">', soy.$$escapeHtml(opt_data.text), '</a>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.icon_item = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<a href="', soy.$$escapeHtml(opt_data.href), '" class="CSS_MAIN_MENU_ICON_ITEM CSS_MAIN_MENU_ITEM"><div class="CSS_MAIN_MENU_ITEM_START"><div class="CSS_ICON ', soy.$$escapeHtml(opt_data.logo), '"></div></div><div class="CSS_MAIN_MENU_ITEM_MID"><div class="CSS_MAIN_MENU_ITEM_TEXT">', soy.$$escapeHtml(opt_data.text), '</div></div><div class="CSS_MAIN_MENU_ITEM_END">', (opt_data.count > 0) ? '<div class="CSS_MAIN_MENU_ITEM_COUNT">' + soy.$$escapeHtml(opt_data.count) + '</div>' : '', '</div></a>');
  if (!opt_sb) return output.toString();
};
