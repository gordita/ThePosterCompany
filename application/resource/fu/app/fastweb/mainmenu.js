goog.provide('fu.app.fastweb.MainMenu');

goog.require('fbapi');
goog.require('fu.async.Callback');
goog.require('fu.ui.BaseAsyncUI');

goog.require('goog.array');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.fu.app.fastweb.MainMenu');


/**
 * @extends {fu.ui.BaseAsyncUI}
 * @constructor
 */
fu.app.fastweb.MainMenu = function() {
  goog.base(this);
};
goog.inherits(fu.app.fastweb.MainMenu, fu.ui.BaseAsyncUI);

/** @inheritDoc */
fu.app.fastweb.MainMenu.prototype.createTemplate = function(payload) {
  return tpl.fu.app.fastweb.MainMenu.element(payload);
};


/** @inheritDoc */
fu.app.fastweb.MainMenu.prototype.createAsyncTemplate = function(payload) {
  return tpl.fu.app.fastweb.MainMenu.asyncElement(payload);
};


/** @inheritDoc */
fu.app.fastweb.MainMenu.prototype.getAsyncData = function() {
  var callback = new fu.async.Callback();

  callback.waitForCallbacks(
    fbapi.query('me'),
    fbapi.query('groups'),
    fbapi.query('friendlists')
  ).then(
    function(values) {
      // Groups.
      var groups = values[1];
      if (goog.isArray(groups['data'])) {
        var groupsData = /** @type {Array} */ (groups['data']);
        groupsData.sort(function(a, b) {
          var va = (a['unread'] || 0) - (a['bookmark_order'] || 0);
          var vb = (b['unread'] || 0) - (b['bookmark_order'] || 0);
          return vb - va;
        });
        groups['data'] = goog.array.slice(groupsData, 0, 7);
      }

      // Friendslist.
      var friendlists = values[2];
      if (goog.isArray(friendlists['data'])) {
        var friendlistsData = /** @type {Array} */ (friendlists['data']);
        friendlists['data'] = goog.array.slice(friendlistsData, 0, 4);
      }

      callback.succeed({
        user : values[0],
        groups : groups,
        friendlists : friendlists
      });
    });

  return callback;
};