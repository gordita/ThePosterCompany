goog.provide('fu.logger');
goog.require('fu.env.runtime');

/**
 * @param {...*} var_args
 */
fu.logger.log = function(var_args) {
  if (fu.env.runtime.ENABLE_LOGGER) {
    fu.logger.console_.log.apply(fu.logger.console_, arguments);
  }
};

/**
 * @type {Console}
 * @private
 */
fu.logger.console_ = /** @type {Console} */(window['console']);