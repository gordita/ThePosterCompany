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
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="', CSS_MAIN_MENU, '">');
  tpl.fu.app.fastweb.MainMenu.user_item({user: opt_data.user, accessToken: opt_data.accessToken}, output);
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Favorites'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'news_feed', text: 'News Feed', href: '/home'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'messages', text: 'Messages', href: '/messages'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'places', text: 'Nearby', href: '/places'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'events', text: 'Events', href: '/events'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'friends', text: 'Friends', href: '/friends'}, output);
  if (opt_data.groups['data']) {
    if (opt_data.groups['data'].length > 0) {
      tpl.fu.app.fastweb.MainMenu.caption({text: 'Groups'}, output);
      var groupList39 = opt_data.groups['data'];
      var groupListLen39 = groupList39.length;
      for (var groupIndex39 = 0; groupIndex39 < groupListLen39; groupIndex39++) {
        var groupData39 = groupList39[groupIndex39];
        tpl.fu.app.fastweb.MainMenu.user_item({user: groupData39, accessToken: opt_data.accessToken}, output);
      }
    }
  }
  if (opt_data.friendlists['data']) {
    if (opt_data.friendlists['data'].length > 0) {
      tpl.fu.app.fastweb.MainMenu.caption({text: 'Lists'}, output);
      var friendlistList50 = opt_data.friendlists['data'];
      var friendlistListLen50 = friendlistList50.length;
      for (var friendlistIndex50 = 0; friendlistIndex50 < friendlistListLen50; friendlistIndex50++) {
        var friendlistData50 = friendlistList50[friendlistIndex50];
        tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'list', text: friendlistData50['name'], href: '/friendlist?id=' + friendlistData50['id']}, output);
      }
    }
  }
  tpl.fu.app.fastweb.MainMenu.caption({text: 'Apps'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'photos', text: 'Photos', href: '/photos'}, output);
  tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'notes', text: 'Notes', href: '/notes'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/acount_settings', text: 'Account Settings'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/privacy_settings', text: 'Privacy Settings'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/report_bug', text: 'Report a Bug'}, output);
  tpl.fu.app.fastweb.MainMenu.link_item({href: '/log_out', text: 'Log Out'}, output);
  output.append('<div class="', CSS_MAIN_MENU_FOOTER, ' ', CSS_MAIN_MENU_ITEM, '"><a href="#" class="', CSS_LINK, '">English(US)</a> &#183; <a href="#" class="', CSS_LINK, '">Help</a> &#183; <a href="#" class="', CSS_LINK, '">Desktop Site</a> &#183; <b><a href="#" class="', CSS_LINK, '">Facebook &copy; 2011</a></b></div></div>');
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
  output.append('<div class="', CSS_MAIN_MENU_CAPTION, ' ', CSS_MAIN_MENU_ITEM, '">', soy.$$escapeHtml(opt_data.text), '</div>');
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
  output.append('<a href="', soy.$$escapeHtml(opt_data.href), '" class="', CSS_MAIN_MENU_LINK_ITEM, ' ', CSS_MAIN_MENU_ITEM, '">', soy.$$escapeHtml(opt_data.text), '</a>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.user_item = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<a href="/profile/', soy.$$escapeHtml(opt_data.user['id']), '" class="', CSS_MAIN_MENU_ICON_ITEM, ' ', CSS_MAIN_MENU_ITEM, '"><div class="', CSS_MAIN_MENU_ITEM_START, '"><div class="', CSS_ICON, '" style="background-image:url( https://graph.facebook.com/', soy.$$escapeHtml(opt_data.user['id']), '/picture?access_token=', soy.$$escapeHtml(opt_data.accessToken), ')"></div></div><div class="', CSS_MAIN_MENU_ITEM_MID, '"><div class="', CSS_MAIN_MENU_ITEM_TEXT, '">', soy.$$escapeHtml(opt_data.user['name']), '</div></div>', (opt_data.user['unread']) ? '<div class="' + CSS_MAIN_MENU_ITEM_END + '"><div class="' + CSS_MAIN_MENU_ITEM_COUNT + '">' + soy.$$escapeHtml(opt_data.user['unread']) + '</div></div>' : '', '</a>');
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
  output.append('<a href="', soy.$$escapeHtml(opt_data.href), '" class="', CSS_MAIN_MENU_ICON_ITEM, ' ', CSS_MAIN_MENU_ITEM, '"><div class="', CSS_MAIN_MENU_ITEM_START, '"><div class="', CSS_ICON, ' ', soy.$$escapeHtml(opt_data.icon), '"></div></div><div class="', CSS_MAIN_MENU_ITEM_MID, '"><div class="', CSS_MAIN_MENU_ITEM_TEXT, '">', soy.$$escapeHtml(opt_data.text), '</div></div>', (opt_data.count > 0) ? '<div class="' + CSS_MAIN_MENU_ITEM_END + '"><div class="' + CSS_MAIN_MENU_ITEM_COUNT + '">' + soy.$$escapeHtml(opt_data.count) + '</div></div>' : '', '</a>');
  if (!opt_sb) return output.toString();
};
