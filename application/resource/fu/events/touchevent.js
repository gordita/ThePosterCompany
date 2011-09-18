goog.provide('fu.events.TouchEvent');

goog.require('goog.events.Event');
goog.require('goog.math.Size');
goog.require('fu.env.client');

/**
 *
 * @param {Event=} opt_e Browser event object.
 * @param {Node=} opt_currentTarget Current target for event.
 * @constructor
 * @extends {goog.events.BrowserEvent}
 */
fu.events.TouchEvent = function(opt_e, opt_currentTarget) {
  goog.base(this, opt_e, opt_currentTarget);
  this.initTouches_();
};
goog.inherits(fu.events.TouchEvent, goog.events.BrowserEvent);


/**
 * @type {Array.<Event>}
 * @private
 */
fu.events.TouchEvent.prototype.touches_ = null;


/**
 * @param {goog.events.BrowserEvent} evt
 * @return {Event}
 */
fu.events.TouchEvent.getTouch = function(evt) {
  var touches = fu.events.TouchEvent.getTouches(evt);
  // TODO(hedger): Maybe return the last one?
  return touches[0];
};


/**
 * @param {goog.events.BrowserEvent} evt
 * @return {Array.<Event>}
 */
fu.events.TouchEvent.getTouches = function(evt) {
  var rev;
  var nativeEvt = evt.getBrowserEvent();
  if (fu.env.client.USE_TOUCH) {
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


/**
 * @return {Event}
 */
fu.events.TouchEvent.prototype.getTouch = function() {
  return this.touches_[0];
};


/**
 * @return {Array.<Event>}
 */
fu.events.TouchEvent.prototype.getTouches = function() {
  return this.touches_;
};


/**
 * @private
 */
fu.events.TouchEvent.prototype.initTouches_ = function() {
  this.touches_ = fu.events.TouchEvent.getTouches(this);
};
