// This file was automatically generated from scroller.tpl.
// Please don't edit this file by hand.

goog.provide('tpl.demo.scroller');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string|undefined}
 * @notypecheck
 */
tpl.demo.scroller.html = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div><div id="scroller"><div class="body"><div id="content" class="unit"><h1>olores eos qui ratione voluptatem</h1><img src="http://placekitten.com/g/150/150"/>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae a b illo inventore veritatis et quasi architecto beatae v itae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque</div></div><div id="logo">scroller demo</div></div></div>');
  if (!opt_sb) return output.toString();
};
