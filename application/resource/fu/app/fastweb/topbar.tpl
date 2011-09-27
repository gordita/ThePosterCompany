{namespace tpl.fu.app.fastweb.TopBar}

/**
 * Template.
 * @param id string
 */
{template .element}
<div id="{$id}" class="{css CSS_TOP_BAR}">
  <div class="{css CSS_GROUP_START}">
    <a href="/menu" class="{css CSS_TOP_BAR_ICON_MENU}">
      menu
    </a>
  </div>
  <div class="{css CSS_GROUP_MIDDLE}">
    <a href="/requests" class="{css CSS_TOP_BAR_ICON_REQUESTS}">
      friend requests
    </a>
    <a href="/inbox" class="{css CSS_TOP_BAR_ICON_INBOX}">
      inbox
    </a>
    <a href="/notifications" class="{css CSS_TOP_BAR_ICON_NOTIFICATIONS}">
      notifications
    </a>
  </div>
  <div class="{css CSS_GROUP_END}">
    <div id="{$id}_contextMenuButtonContainer">
    </div>
  </div>
</div>
{/template}