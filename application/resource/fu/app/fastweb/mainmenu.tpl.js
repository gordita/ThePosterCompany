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
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '_element"  class="', CSS_MAIN_MENU, '"><div id="', soy.$$escapeHtml(opt_data.id), '_content"></div></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.asyncElement = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '_asyncElement">');
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
      var groupList45 = opt_data.groups['data'];
      var groupListLen45 = groupList45.length;
      for (var groupIndex45 = 0; groupIndex45 < groupListLen45; groupIndex45++) {
        var groupData45 = groupList45[groupIndex45];
        tpl.fu.app.fastweb.MainMenu.user_item({user: groupData45, accessToken: opt_data.accessToken}, output);
      }
    }
  }
  if (opt_data.friendlists['data']) {
    if (opt_data.friendlists['data'].length > 0) {
      tpl.fu.app.fastweb.MainMenu.caption({text: 'Lists'}, output);
      var friendlistList56 = opt_data.friendlists['data'];
      var friendlistListLen56 = friendlistList56.length;
      for (var friendlistIndex56 = 0; friendlistIndex56 < friendlistListLen56; friendlistIndex56++) {
        var friendlistData56 = friendlistList56[friendlistIndex56];
        tpl.fu.app.fastweb.MainMenu.icon_item({icon: 'list', text: friendlistData56['name'], href: '/friendlist?id=' + friendlistData56['id']}, output);
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
  output.append('<a href="/profile/', soy.$$escapeHtml(opt_data.user['id']), '" class="', CSS_MAIN_MENU_ICON_ITEM, ' ', CSS_MAIN_MENU_ITEM, '"><div class="', CSS_MAIN_MENU_ITEM_START, '">');
  if (opt_data.user['id']) {
    tpl.fu.app.fastweb.MainMenu.user_icon({uid: opt_data.user['id'], accessToken: opt_data.accessToken}, output);
  } else if (opt_data.user['uid']) {
    tpl.fu.app.fastweb.MainMenu.user_icon({uid: opt_data.user['uid'], accessToken: opt_data.accessToken}, output);
  }
  output.append('</div><div class="', CSS_MAIN_MENU_ITEM_MID, '"><div class="', CSS_MAIN_MENU_ITEM_TEXT, '">', soy.$$escapeHtml(opt_data.user['name']), '</div></div>', (opt_data.user['unread']) ? '<div class="' + CSS_MAIN_MENU_ITEM_END + '"><div class="' + CSS_MAIN_MENU_ITEM_COUNT + '">' + soy.$$escapeHtml(opt_data.user['unread']) + '</div></div>' : '', '</a>');
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


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.MainMenu.user_icon = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_ICON, '" style="background-image:url( https://graph.facebook.com/', soy.$$escapeHtml(opt_data.uid), '/picture?access_token=', soy.$$escapeHtml(opt_data.accessToken), ')"></div>');
  if (!opt_sb) return output.toString();
};
