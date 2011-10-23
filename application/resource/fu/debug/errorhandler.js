goog.provide('fu.debug.ErrorHandler');

/**
 * @param {string} msg
 * @param {string} url
 * @param {number} line
 */
fu.debug.ErrorHandler.onWindowError = function(msg, url, line) {
  var stacks = [msg, url, line];
  var fn = arguments.callee.caller;
  var fns = [];
  while (fn && !fn.__debug__) {
    fn.__debug__ = true;
    stacks.push(fn.toString());
    fns.push(fn);
    fn = fn.caller;
  }
  while (fns.length) {
    fn = fns.pop();
    delete fn.__debug__;
  }
  alert(stacks.join('\n'));
};