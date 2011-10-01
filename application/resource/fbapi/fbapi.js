goog.provide('fbapi');

goog.require('fu.async.Callback');
goog.require('fu.env.runtime');
goog.require('fu.logger');
goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.dom');

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
  return fbapi.getApi().then(function() {
    goog.asserts.assert(fbapi._accessToken, 'access token is null');

    var id = opt_id ? opt_id : 'me';
    var fullPath = (path == 'me') ? path : '/' + id + '/' + path;
    var callback = new fu.async.Callback();

    if (fbapi._queryCache[fullPath]) {
      return callback.willSucceed(fbapi._queryCache[fullPath]);
    }

    fu.logger.log('query', fullPath);

    fbapi._api.api(fullPath, function(results) {
      if (fbapi._checkResults(results)) {
        fu.logger.log('query:results:pass', fullPath, results);
        results.cachedTime = goog.now();
        results.accessToken = fbapi._accessToken;
        fbapi._queryCache[fullPath] = results;
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

if (!fu.env.runtime.USE_MOCK_DATA) {
  fbapi._install();
}

