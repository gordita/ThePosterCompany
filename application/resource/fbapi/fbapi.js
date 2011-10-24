goog.provide('fbapi');

goog.require('data.AlbumsFeed');
goog.require('data.CheckInsFeed');
goog.require('data.FriendsFeed');
goog.require('data.FriendsList');
goog.require('data.GroupsFeed');
goog.require('data.InfoFeed');
goog.require('data.NewsFeed');
goog.require('data.NotificationsFeed');
goog.require('data.PhotoFeed');
goog.require('data.PhotosFeed');
goog.require('data.ProfileFeed');
goog.require('data.User');
goog.require('fu.async.Callback');
goog.require('fu.env.runtime');
goog.require('fu.logger');
goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.json');

/**
 * @const
 * @type {string}
 */
fbapi.API_SRC = 'http://connect.facebook.net/en_US/all.js';


/**
 * @const
 * @type {string}
 */
fbapi.API_ID = '168904136523866';


/**
 * @const
 * @type {string}
 */
fbapi.API_SECRET = 'ce6779fa1b6a7594d2390eec440039f4';

/**
 * @const
 * @type {number}
 */
fbapi.EXPIRE_LIMIT = 10 * 1000 * 60 * 60;

/**
 * Login.
 */
fbapi.login = function() {
  var uri = new goog.Uri('https://graph.facebook.com/oauth/authorize');
  uri.setParameterValue('response_type', 'token');
  uri.setParameterValue('client_id', fbapi.API_ID);
  uri.setParameterValue('scope', fbapi._permissions.join(','));
  uri.setParameterValue('redirect_uri', top.location.href);
  top.location.href = uri.toString();
};


/**
 * @return {?string}
 */
fbapi.getAccessToken = function() {
  return fbapi._accessToken;
};

/**
 * @return {fu.async.Callback}
 */
fbapi.getApi = function() {
  return (new fu.async.Callback()).waitFor(function() {
    if (fbapi._api) {
      return fbapi._api;
    }
  });
};

/**
 * @param {string} path
 * @param {string=} opt_id
 * @return {fu.async.Callback}
 */
fbapi.query = function(path, opt_id) {
  if (fu.env.runtime.USE_MOCK_DATA) {
    return fbapi._queryMock(path);
  }

  return fbapi.getApi().then(function() {
    goog.asserts.assert(fbapi._accessToken, 'access token is null');

    var id = opt_id ? opt_id : 'me';
    var fullPath = (path == 'me') ? path : '/' + id + '/' + path;
    var callback = new fu.async.Callback();
    var cachedResults = fbapi._queryFromCache(fullPath);

    if (cachedResults) {
      return callback.willSucceed(cachedResults);
    }

    fu.logger.log('query', fullPath);

    fbapi._api.api(fullPath, function(results) {
      if (fbapi._checkResults(results)) {
        fu.logger.log('query:results:pass', fullPath, results);
        fbapi._saveToCache(fullPath, results);
        results = fbapi._queryFromCache(fullPath);
        callback.succeed(results);
      } else {
        fu.logger.log('query:results:fail', fullPath, results);
        callback.fail(results);
      }
      fullPath = null;
    });

    return callback;
  });
};


/**
 * @return {fu.async.Callback}
 */
fbapi.checkLogin = function() {
  var callback = new fu.async.Callback();
  if (fu.env.define.USE_MOCK_DATA) {
    return callback.willSucceed(true);
  }
  if (goog.isBoolean(fbapi._loggedIn)) {
    return callback.willSucceed(fbapi._loggedIn);
  } else {
    return callback.waitFor(function() {
      return goog.isBoolean(fbapi._loggedIn) ? fbapi._loggedIn : undefined;
    });
  }
};

/**
 * @type {FbApi}
 * @private
 */
fbapi._api = null;

/**
 * @type {Object}
 * @private
 */
fbapi._queryCache = {};


/**
 * @type {?string}
 * @private
 */
fbapi._accessToken = null;

/**
 * @type {?string}
 * @private
 */
fbapi._uid = null;

/**
 * @type {boolean|undefined}
 * @private
 */
fbapi._loggedIn = undefined;

/**
 * @const
 * @type {Array.<string>}
 */
fbapi._permissions = [
  'create_event',
  'create_note',
  'export_stream',
  'friends_about_me',
  'friends_activities',
  'friends_birthday',
  'friends_checkins',
  'friends_education_history',
  'friends_events',
  'friends_groups',
  'friends_hometown',
  'friends_interests',
  'friends_likes',
  'friends_location',
  'friends_notes',
  'friends_online_presence',
  'friends_photo_video_tags',
  'friends_photos',
  'friends_relationship_details',
  'friends_relationships',
  'friends_religion_politics',
  'friends_status',
  'friends_videos',
  'friends_website',
  'friends_work_history',
  'manage_friendlists',
  'manage_notifications',
  'manage_pages',
  'photo_upload',
  'publish_checkins',
  'publish_stream',
  'read_friendlists',
  'read_insights',
  'read_mailbox',
  'read_requests',
  'read_stream',
  'rsvp_event',
  'share_item',
  'status_update',
  'user_about_me',
  'user_activities',
  'user_birthday',
  'user_checkins',
  'user_education_history',
  'user_events',
  'user_groups',
  'user_hometown',
  'user_interests',
  'user_likes',
  'user_location',
  'user_notes',
  'user_online_presence',
  'user_photo_video_tags',
  'user_photos',
  'user_relationship_details',
  'user_relationships',
  'user_religion_politics',
  'user_status',
  'user_videos',
  'user_website',
  'user_work_history',
  'video_upload'
];


/**
 * @param {Object} results
 * @return {boolean}
 */
fbapi._checkResults = function(results) {
  return !!results && !results['errors'] && goog.isObject(results);
};

/**
 * @private
 */
fbapi._install = function() {
  var callback;

  try {
    fu.logger.log('trying install fbapi');
    callback = new fu.async.Callback();
  } catch (notFound) {
    window.setTimeout(fbapi._install, 100);
    return;
  }

  callback.
    waitFor(
    function() {
      return document.body ? true : undefined;
    }).
    then(
    function() {
      window['fbAsyncInit'] = function() {
        window['fbAsyncInit'] = null;

        var api = /** {FbApi} */ (window['FB']);

        // https://developers.facebook.com/docs/reference/javascript/FB.init
        api.init({
          'appId': fbapi.API_ID,
          'status': true, // check login status
          'cookie': true, // allow the server to access session.
          'xfbml': false // parse XFBML
        });

        api.getLoginStatus(function(response) {
          fu.logger.log('fbapi#getLoginStatus', response);
          fbapi._accessToken =
            String(goog.getObjectByName('session.access_token', response));
          fbapi._uid =
            String(goog.getObjectByName('session.uid', response));
          if (fbapi._accessToken && response['session'] && response['session']) {
            fbapi._loggedIn = true;
          } else {
            fbapi._loggedIn = false;
          }
          fbapi._api = api;
          api = null;
        });
      };

      var script = goog.dom.createDom('script', {
        'src': fbapi.API_SRC,
        'async': 'async',
        'defer': 'defer'
      });
      var el = goog.dom.createDom('div', {
        'id': 'fb-root'
      });
      document.body.insertBefore(el, document.body.firstChild);
      el.appendChild(script);
    }).
    waitFor(
    function() {
      return fbapi._loggedIn;
    }).
    then(function() {
      fu.logger.log('fbapi installed');
    });
};

/**
 * @param {string} path
 * @return {fu.async.Callback}
 */
fbapi._queryMock = function(path) {
  var callback = new fu.async.Callback();
  var map = {
    'groups' : data.GroupsFeed,
    'friendlists' : data.FriendsList,
    'me' : data.User,
    'home' : data.NewsFeed
  };
  if (map[path]) {
    return callback.willSucceed(map[path]);
  } else {
    fu.logger.log('mock data for:', path);
    return callback.willFail(null);
  }
};

/**
 * @param {?string} fullPath
 * @return {Object}
 * @private
 */
fbapi._queryFromCache = function(fullPath) {
  var results = fbapi._queryCache[fullPath];

  if (results) {
    // Remove the BaseUI id.
    delete results.id;
    results.accessToken = fbapi._accessToken;
    results.uid = fbapi._uid;
    return results;
  }

  if (!fu.env.runtime.USE_LOCAL_STORAGE) {
    return null;
  }

  var storage = window['localStorage'];
  goog.asserts.assert(!!storage, 'localStorage is not available');
  goog.asserts.assert(!!fbapi._uid, 'uid is empty');

  var key = fbapi._uid + '@' + fullPath;
  var value;
  try {
    value = storage.getItem(key);
    results = goog.json.parse(value);

    if (results.cachedTime) {
      var duration = goog.now() - results.cachedTime;
      if (duration > fbapi.EXPIRE_LIMIT) {
        fu.logger.log('fbapi._queryFromCache:expire', fullPath, duration);
        storage.removeItem(key);
        return null;
      }
    }

  } catch(ex) {
    fu.logger.log('localStorage:error', fullPath, ex);
    return null;
  }
  fbapi._queryCache[fullPath] = results;
  fu.logger.log('fbapi._queryFromCache', fullPath, results);
  return fbapi._queryFromCache(fullPath);
};


/**
 * @param {?string} fullPath
 * @param {Object} results
 */
fbapi._saveToCache = function(fullPath, results) {
  results.cachedTime = goog.now();

  // Remove the BaseUI id.
  delete results.id;
  delete results.accessToken;
  delete results.uid;
  results.cachedTime = goog.now();

  fbapi._queryCache[fullPath] = results;
  if (!fu.env.runtime.USE_LOCAL_STORAGE) {
    return;
  }
  var storage = window['localStorage'];
  goog.asserts.assert(!!storage, 'localStorage is not available');
  goog.asserts.assert(!!fbapi._uid, 'uid is empty');

  var key = fbapi._uid + '@' + fullPath;

  try {
    storage.setItem(key, goog.json.serialize(results));
  } catch(ex) {
    fu.logger.log('fbapi._saveToCache:error', fullPath, ex);
  }
};


if (!fu.env.runtime.USE_MOCK_DATA) {
  fbapi._install();
}

