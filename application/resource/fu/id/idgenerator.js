goog.provide('fu.id.IdGenerator');

/**
 * @return {string}
 */
fu.id.IdGenerator.next = function() {
  return 'fuid-' + (fu.id.IdGenerator._seed++).toString(16);
};

/**
 * @type {number}
 * @private
 */
fu.id.IdGenerator._seed = 0;