// This file was automatically generated from newsfeed.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.fu.app.fastweb.NewsFeed');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.asyncElement = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '_asyncElement">');
  tpl.fu.app.fastweb.NewsFeed.listItems_({items: opt_data.data}, output);
  output.append('</div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.listItems_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<ul>');
  var itemList11 = opt_data.items;
  var itemListLen11 = itemList11.length;
  for (var itemIndex11 = 0; itemIndex11 < itemListLen11; itemIndex11++) {
    var itemData11 = itemList11[itemIndex11];
    tpl.fu.app.fastweb.NewsFeed.listitem_({item: itemData11}, output);
  }
  output.append('</ul>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.listitem_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<li class="', CSS_NEWS_FEED_LIST_ITEM, '"><div class="', CSS_NEWS_FEED_LIST_ITEM_GRID, '"><div class="', CSS_NEWS_FEED_LIST_ITEM_ROW, '"><div class="', CSS_NEWS_FEED_LIST_ITEM_SIDE, '">');
  tpl.fu.app.fastweb.NewsFeed.icon_(opt_data, output);
  output.append('</div><div class="', CSS_NEWS_FEED_LIST_ITEM_CONTEXT, '">');
  tpl.fu.app.fastweb.NewsFeed.likeOrComment_(opt_data, output);
  tpl.fu.app.fastweb.NewsFeed.namelink_(opt_data, output);
  tpl.fu.app.fastweb.NewsFeed.itemContent_(opt_data, output);
  output.append('</div></div></div></li>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.likeOrComment_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  if (opt_data.item['actions']) {
    if (opt_data.item['actions'].length == 2) {
      output.append('<div tabindex="1" cmd="like_or_comment" class="', CSS_NEWS_FEED_LIST_ITEM_LIKE_OR_RESPOND, '">');
      tpl.fu.app.fastweb.NewsFeed.likeOrCommentActions_(opt_data, output);
      output.append('</div>');
    }
  }
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.likeOrCommentActions_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_NEWS_FEED_LIST_ITEM_LIKE_OR_RESPOND_POPUP, '"><a cmd="', soy.$$escapeHtml(opt_data.item['actions'][1]['name']), '" debug-href="', soy.$$escapeHtml(opt_data.item['actions'][1]['link']), '" class="', LIKE_BUTTON, ' ', ICON_BUTTON, '">Like</a><a cmd="', soy.$$escapeHtml(opt_data.item['actions'][0]['name']), '" debug-href="', soy.$$escapeHtml(opt_data.item['actions'][0]['link']), '" class="', ICON_BUTTON, '">Comment</a><i class="', CSS_SHADOW_LEFT, '"></i><i class="', CSS_SHADOW_RIGHT, '"></i></div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.namelink_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((opt_data.item['from']) ? '<a href="//www.facebook.com/profile.php?id=' + soy.$$escapeHtml(opt_data.item['from']['id']) + '" class="' + CSS_NEWS_FEED_LIST_ITEM_NAME_LINK + '">' + soy.$$escapeHtml(opt_data.item['from']['name']) + '</a>' : '');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.icon_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((opt_data.item['from']) ? '<img class="' + CSS_NEWS_FEED_LIST_ITEM_ICON + '" src="//graph.facebook.com/' + soy.$$escapeHtml(opt_data.item['from']['id']) + '/picture" alt=""/>' : (opt_data.item['icon']) ? '<img class="' + CSS_NEWS_FEED_LIST_ITEM_ICON + '" src="' + soy.$$escapeHtml(opt_data.item['icon']) + '" alt=""/>' : '');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.cssImage_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<span class="', CSS_IMAGE, '" style="background-image:url(', soy.$$escapeHtml(opt_data.src), ')"></span>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.itemContent_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  switch (opt_data.item['type']) {
    case 'video':
      tpl.fu.app.fastweb.NewsFeed.videoItem_(opt_data, output);
      break;
    case 'status':
      tpl.fu.app.fastweb.NewsFeed.statusItem_(opt_data, output);
      break;
    case 'link':
      tpl.fu.app.fastweb.NewsFeed.linkItem_(opt_data, output);
      break;
    case 'photo':
      tpl.fu.app.fastweb.NewsFeed.photoItem_(opt_data, output);
      break;
    default:
      output.append('### ', soy.$$escapeHtml(opt_data.item['type']), ' ###');
  }
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.videoItem_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_NEWS_FEED_LIST_ITEM_VIDEO, '"><h4><a href="', soy.$$escapeHtml(opt_data.item['source']), '">', soy.$$escapeHtml(opt_data.item['name']), '</a></h4>', (opt_data.item['caption']) ? '<div class="' + CSS_NEWS_FEED_LIST_ITEM_MINOR_TEXT + '">' + soy.$$escapeHtml(opt_data.item['caption']) + '</div>' : '', (opt_data.item['description']) ? '<div class="' + CSS_NEWS_FEED_LIST_ITEM_VIDEO_DESCRIPTION + '">' + soy.$$escapeHtml(opt_data.item['description']) + '</div>' : '', '</div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.statusItem_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="', CSS_NEWS_FEED_LIST_ITEM_STATUS, '">', (opt_data.item['message']) ? soy.$$escapeHtml(opt_data.item['message']) : '', '</div>');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.linkItem_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((opt_data.item['message']) ? '<div class="' + CSS_NEWS_FEED_LIST_ITEM_LINK_MESSAGE + '">' + soy.$$escapeHtml(opt_data.item['message']) + '</div>' : '', (opt_data.item['description']) ? (opt_data.item['link']) ? '<div><a href="' + soy.$$escapeHtml(opt_data.item['link']) + '">' + soy.$$escapeHtml(opt_data.item['description']) + '</a></div>' : '' : '', (opt_data.item['caption']) ? '<div class="' + CSS_NEWS_FEED_LIST_ITEM_MINOR_TEXT + '">' + soy.$$escapeHtml(opt_data.item['caption']) + '</div>' : '');
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.photoItem_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  if (opt_data.item['link']) {
    if (opt_data.item['name']) {
      output.append('<div><a href="', soy.$$escapeHtml(opt_data.item['link']), '">', soy.$$escapeHtml(opt_data.item['name']), '</a></div>');
      if (opt_data.item['properties']) {
        var propertyList183 = opt_data.item['properties'];
        var propertyListLen183 = propertyList183.length;
        for (var propertyIndex183 = 0; propertyIndex183 < propertyListLen183; propertyIndex183++) {
          var propertyData183 = propertyList183[propertyIndex183];
          output.append((propertyData183['text']) ? ((propertyData183['name']) ? '<span>' + soy.$$escapeHtml(propertyData183['name']) + ' : </span>' : '') + ((propertyData183['href']) ? '<a href="' + soy.$$escapeHtml(propertyData183['href']) + '">' + soy.$$escapeHtml(propertyData183['text']) + '</a>' : soy.$$escapeHtml(propertyData183['text'])) + '<br />' : '');
        }
      }
    }
    output.append((opt_data.item['picture']) ? '<a href="' + soy.$$escapeHtml(opt_data.item['link']) + '" class="' + CSS_NEWS_FEED_LIST_ITEM_PHOTO_LINK + '"><img src="' + soy.$$escapeHtml(opt_data.item['picture']) + '" class="' + CSS_NEWS_FEED_LIST_ITEM_PHOTO_IMG + '" /></a>' : '');
  }
  if (!opt_sb) return output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.fu.app.fastweb.NewsFeed.actions_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((opt_data.item['actions']) ? (opt_data.item['actions'].length > 0) ? soy.$$escapeHtml(opt_data.item['actions'][opt_data.item['actions'].length - 1]) : '' : '');
  if (!opt_sb) return output.toString();
};
