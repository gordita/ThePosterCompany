{namespace tpl.fu.layout.Stack}

/**
 * Template.
 * @param id string
 */
{template .element}
<div id="{$id}" class="{css CSS_STACK_LAYOUT}">
</div>
{/template}


/**
 * Template.
 * @param id string
 */
{template .head}
<div class="{css CSS_STACK_LAYOUT_HEAD}">
  <div id="{$id}_content" class="{css CSS_STACK_LAYOUT_CONTENT}"></div>
</div>
{/template}

/**
 * Template.
 * @param id string
 */
{template .body}
<div class="{css CSS_STACK_LAYOUT_BODY}">
  <div id="{$id}_content" class="{css CSS_STACK_LAYOUT_CONTENT}">
  </div>
</div>
{/template}
  

/**
 * Template.
 * @param id string
 */
{template .foot}
<div class="{css CSS_STACK_LAYOUT_FOOT}">
 <div id="{$id}_content" class="{css CSS_STACK_LAYOUT_CONTENT}"></div>
</div>
{/template}