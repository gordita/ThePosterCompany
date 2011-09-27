goog.provide('demo.test');

goog.require('fu.app.fastweb.Chrome');
goog.require('fu.events.EventType');
goog.require('fu.layout.FullView');
goog.require('fu.ui.BaseUI');
goog.require('goog.events.EventHandler');

/**
 * Start
 */
demo.test.start = function() {
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

/**
 * Start
 */
demo.test.start2 = function() {
  new fu.app.fastweb.Chrome();
};
goog.exportSymbol('start', demo.test.start2);