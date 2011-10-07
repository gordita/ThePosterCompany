goog.provide('fu.app.fastweb.UrlMap');


/**
 * @enum {string}
 */
fu.app.fastweb.UrlMap.Action = {
  SIDE_MENU: 'sidemenu',
  TOP_POPUP: 'toppopup',
  DIALOG_VIEW: 'dialogview',
  MAIN_VIEW : 'mainview'
};


/**
 * @type {Array.<Array>}
 */
fu.app.fastweb.UrlMap.Urls = [
  [/^\/menu/g, fu.app.fastweb.UrlMap.Action.SIDE_MENU],
  [/^\/requests/g, fu.app.fastweb.UrlMap.Action.TOP_POPUP],
  [/^\/inbox/g, fu.app.fastweb.UrlMap.Action.TOP_POPUP],
  [/^\/notifications/g, fu.app.fastweb.UrlMap.Action.TOP_POPUP],
  [/^\/profile/g, fu.app.fastweb.UrlMap.Action.MAIN_VIEW],
  [/.*/g, fu.app.fastweb.UrlMap.Action.MAIN_VIEW]
];