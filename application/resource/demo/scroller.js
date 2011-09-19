goog.provide('demo.scroller');

goog.require('demo.scroller.tpl');
goog.require('fu.ui.scroll.TouchScroller');
goog.require('soy');

/**
 * Start
 */
demo.scroller.start = function() {
  var doc = document.getElementById('doc');
  doc.appendChild(soy.renderAsFragment(demo.scroller.tpl.html));

  var scroller = document.getElementById('scroller');
  var content = document.getElementById('content');
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

  document.addEventListener('touchstart', blockEvent, false);
  document.addEventListener('touchmove', blockEvent, false);
  document.addEventListener('resize', resize, false);
  document.addEventListener('orientationchange', resize, false);
  document.addEventListener('touchstart', resize, false);

  resize();
  new fu.ui.scroll.TouchScroller(scroller);
};

goog.exportSymbol('start', demo.scroller.start);