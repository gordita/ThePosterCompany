goog.provide('fu.events');

goog.require('goog.events.BrowserEvent');
goog.require('goog.math.Coordinate');

/**
 * @param {goog.events.BrowserEvent} evt
 * @return {Event}
 */
fu.events.getTouch = function(evt) {
  var touches = fu.events.getTouches(evt);
  return touches[0];
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @return {boolean}
 */
fu.events.isPrevented = function(evt) {
  var be = evt.getBrowserEvent();
  return !!be['defaultPrevented'];
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @return {goog.math.Coordinate}
 */
fu.events.getTouchPagePosition = function(evt) {
  var touch = fu.events.getTouch(evt);
  return new goog.math.Coordinate(touch.pageX, touch.pageY);
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @return {Array.<Event>}
 */
fu.events.getTouches = function(evt) {
  var rev;
  var nativeEvt = evt.getBrowserEvent();
  if (fu.env.runtime.USE_TOUCH) {
    // TODO(hedger): Returns a normalized event.
    if (nativeEvt['touches'] && nativeEvt['touches'][0]) {
      rev = nativeEvt['touches'];
    } else if (nativeEvt['changedTouches'] && nativeEvt['changedTouches'][0]) {
      rev = nativeEvt['changedTouches'];
    } else if (nativeEvt['targetTouches'] && nativeEvt['targetTouches'][0]) {
      rev = nativeEvt['targetTouches'];
    } else {
      rev = [nativeEvt];
    }
  } else {
    rev = [nativeEvt];
  }
  return /** @type {Array.<Event>} */ (rev);
};


