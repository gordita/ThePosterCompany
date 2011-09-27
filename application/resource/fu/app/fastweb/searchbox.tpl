{namespace tpl.fu.app.fastweb.SearchBox}

/**
 * Template.
 * @param id string
 */
{template .element}
<div id="{$id}" class="{css CSS_SEARCH_BOX}">
  <div class="{css CSS_SEARCH_BOX_INPUT_WRAP}">
    <div id="{$id}_input"
         tabindex="1"
         role="button"
         class="{css CSS_SEARCH_BOX_INPUT}">
      Search
    </div>
  </div>
  <div class="{css CSS_SEARCH_BOX_BUTTON_WRAP}">
    <div id="{$id}_button"
         tabindex="1"
         role="button"
         class="{css CSS_SEARCH_BOX_BUTTON}">
      Cancel
    </div>
  </div>
</div>
{/template}