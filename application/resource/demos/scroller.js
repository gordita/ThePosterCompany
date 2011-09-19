goog.provide('demos.scroller');

goog.require('demos.scroller.tpl');
goog.require('fu.ui.scroll.TouchScroller');
goog.require('soy');

demos.scroller.start = function() {
  document.getElementById('doc').appendChild(
    soy.renderAsFragment(demos.scroller.tpl.html));

  var blockEvent = function(evt) {
    evt.preventDefault();
  };

  var scroller = document.getElementById('scroller');

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

  var content = document.getElementById('content');
  var frag = document.createDocumentFragment();
  var n = 0;
  while (n < 12) {
    n++;
    frag.appendChild(content.cloneNode(true));
  }
  content.parentNode.appendChild(frag);

  new fu.ui.scroll.TouchScroller(scroller);
};

goog.exportSymbol('start', demos.scroller.start);