goog.provide('fbapi');

goog.require('fu.async.Callback');
goog.require('fu.logger');
goog.require('goog.dom');

/**
 * @return {fu.async.Callback}
 */
fbapi.query = function(path) {
  var callback = new fu.async.Callback();
  fbapi._getApi().then(function() {
    alert(fbapi._api);
  });
  return callback;
};


/**
 * @type {FbApi}
 * @private
 */
fbapi._api = null;

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
 * @return {fu.async.Callback}
 * @private
 */
fbapi._getApi = function() {
  var callback = new fu.async.Callback();
  if (fbapi._api) {
    callback.willSucceed(fbapi._api);
  } else {
    callback.waitFor(function() {
      return fbapi._api ? fbapi._api : undefined;
    });
  }
  return callback;
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
        fbapi._api = /** {FbApi} */ (window['FB']);

        // https://developers.facebook.com/docs/reference/javascript/FB.init
        fbapi._api.init({
          'appId': fbapi.API_ID,
          'status': true, // check login status
          'cookie': true, // allow the server to access session.
          'xfbml': false // parse XFBML
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
      return fbapi._api ? true : undefined;
    }).
    then(function() {
      fu.logger.log('fbapi installed');
    });
};

fbapi._install();