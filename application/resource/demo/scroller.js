goog.provide('demo.scroller');


goog.require('fu.env.define');
goog.require('fu.ui.scroll.TouchScroller');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('soy');
goog.require('tpl.fu.CSSNames');
goog.require('tpl.demo.scroller');


/**
 * Start
 */
demo.scroller.start = function() {
  var doc = document.getElementById('doc');
  doc.appendChild(soy.renderAsFragment(tpl.demo.scroller.html));

  var scroller = goog.dom.getElement('scroller');
  var content = goog.dom.getElement('content');
  var frag = document.createDocumentFragment();
  var n = 0;

  while (n < 12) {
    n++;
    frag.appendChild(content.cloneNode(true));
  }
  content.parentNode.appendChild(frag);

  /**
   * @param {Event} evt
   */
  var blockEvent = function(evt) {
    evt.preventDefault();
  };

  var resize = function() {
    var h = Math.min(480, window.innerHeight);
    scroller.style.height = h + 'px';
  };

  var handler = new goog.events.EventHandler();
  handler.listen(document, 'touchstart', blockEvent, false)
  handler.listen(document, 'touchstart', blockEvent, false);
  handler.listen(document, 'touchmove', blockEvent, false);
  handler.listen(document, 'resize', resize, false);
  handler.listen(document, 'orientationchange', resize, false);
  handler.listen(document, 'touchstart', resize, false);

  resize();
  new fu.ui.scroll.TouchScroller(scroller);
};

goog.exportSymbol('start', demo.scroller.start);