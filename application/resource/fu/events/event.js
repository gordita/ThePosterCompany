goog.provide('fu.events.Event');

goog.require('goog.Uri');
goog.require('goog.events.Event');
goog.require('goog.math.Size');


/**
 * A base class for event objects, so that they can support preventDefault and
 * stopPropagation.
 *
 * @param {string} type Event Type.
 * @param {Object=} opt_target
 * @constructor
 * @extends {goog.events.Event}
 */
fu.events.Event = function(type, opt_target) {
  goog.base(this, type, opt_target);
};
goog.inherits(fu.events.Event, goog.events.Event);

/**
 * @type {number}
 */
fu.events.Event.prototype.index = -1;


/**
 * @type {Object}
 */
fu.events.Event.prototype.data = null;

/**
 * @type {*}
 */
fu.events.Event.prototype.value = null;

/**
 * @type {?string}
 */
fu.events.Event.prototype.href = null;

/**
 * @type {goog.math.Size}
 */
fu.events.Event.prototype.size = null;


/**
 * @type {boolean}
 */
fu.events.Event.prototype.changed = false;


/**
 * @type {goog.Uri}
 */
fu.events.Event.prototype.uri = null;

/**
 * @type {?string}
 */
fu.events.Event.prototype.name = null;