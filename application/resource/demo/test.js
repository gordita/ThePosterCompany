goog.provide('demo.test');

goog.require('fbapi');
goog.require('fu.app.fastweb.Chrome');
goog.require('fu.async.Callback');
goog.require('fu.events.EventType');
goog.require('fu.layout.FullView');
goog.require('fu.logger');
goog.require('fu.ui.BaseUI');
goog.require('goog.events.EventHandler');

// Test
demo.test.testLayout = function() {
  var doc = goog.dom.getElement('doc');
  var wall = new fu.layout.FullView();
  wall.render(doc);

  var s1 = new fu.ui.BaseUI();
  var s2 = new fu.ui.BaseUI();
  s1.addChild(s2);

  wall.addChild(s1);

  var menu = new fu.layout.FullView();
  menu.render(doc);

  wall.bringToTop();

  var handler = new goog.events.EventHandler();
  var opened = false;
  var menuWidth = 500;
  handler.listen(document, fu.events.EventType.TOUCHSTART, function() {
    opened = !opened;
    if (opened) {
      wall.moveTo(menuWidth, 0);
    } else {
      wall.moveTo(0, 0);
    }
  }, true);
};

// Test
demo.test.testChrome = function() {
  new fu.app.fastweb.Chrome();
};

// Test
demo.test.testAsync = function() {
//  var cb1 = new fu.async.Callback();
//  cb1.then(
//    function(res) {
//      fu.logger.log('cb1', res);
//      var cb2 = new fu.async.Callback();
//      window.setTimeout(function() {
//        cb2.succeed('world');
//      }, 10);
//      return cb2;
//    }
//  ).then(
//    function(res) {
//      fu.logger.log('cb2', res);
//    }
//  );
//
//  cb1.succeed('hello');

  var foo, bar, kuu;

  window.setTimeout(function() {
    foo = 'foo';
  }, 400);

  window.setTimeout(function() {
    bar = 'bar';
  }, 200);

  var cb3 = new fu.async.Callback();
  var cb4 = new fu.async.Callback();

  setTimeout(function() {
    cb4.succeed('kuu')
  }, 100);

  cb3.
    waitFor(
    function() {
      return foo ? 'foo' : undefined;
    }).
    waitFor(
    function() {
      return bar ? 'bar' : undefined;
    }).
    waitFor(cb4)
    .then(
    function(res) {
      fu.logger.log('cb3', res, foo, bar);
    });
};

// Test.
demo.test.testFbApi = function() {
  fbapi.checkLogin().then(function(pass) {
    if (!pass) {
      fbapi.login();
    } else {
      fbapi.query('groups');
    }
  });
};

goog.exportSymbol('start', demo.test.testChrome);