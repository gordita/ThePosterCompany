{namespace tpl.fu.app.fastweb.MainMenu}

/**
 * Template.
 * @param id string
 */
{template .element}
<div id="{$id}" class="{css CSS_MAIN_MENU}">
  {call .caption}
    {param text: 'Favorites' /}
  {/call}

  {call .caption}
    {param text: 'Groups' /}
  {/call}

  {call .caption}
    {param text: 'Lists' /}
  {/call}

  {call .caption}
    {param text: 'Apps' /}
  {/call}

  {call .link_item}
    {param href: '/acount_settings' /}
    {param text: 'Account Settings' /}
  {/call}

  {call .link_item}
    {param href: '/privacy_settings' /}
    {param text: 'Privacy Settings' /}
  {/call}

  {call .link_item}
    {param href: '/report_bug' /}
    {param text: 'Report a Bug' /}
  {/call}

  {call .link_item}
    {param href: '/log_out' /}
    {param text: 'Log Out' /}
  {/call}

  <div class="{css CSS_MAIN_MENU_FOOTER} {css CSS_MAIN_MENU_ITEM}">
    <a href="#" class="{css CSS_LINK}">English(US)</a>
    {sp}&#183;{sp}
    <a href="#" class="{css CSS_LINK}">Help</a>
    {sp}&#183;{sp}
    <a href="#" class="{css CSS_LINK}">Desktop Site</a>
    {sp}&#183;{sp}
    <b>
      <a href="#" class="{css CSS_LINK}">Facebook &copy; 2011</a>
    </b>
  </div>
</div>
{/template}


/**
 * @param text
 */
{template .caption}
<div class="{css CSS_MAIN_MENU_CAPTION} {css CSS_MAIN_MENU_ITEM}">
  {$text}
</div>
{/template}

/**
 * @param text
 * @param href
 */
{template .link_item}
<a href="{$href}" class="{css CSS_MAIN_MENU_LINK_ITEM}  {css CSS_MAIN_MENU_ITEM}">
  {$text}
</a>
{/template}


/**
 * template.
 * @param logo
 * @param text
 * @param href
 * @param count
 */
{template .icon_item }
<a href="{$href}" class="{css CSS_MAIN_MENU_ICON_ITEM} {css CSS_MAIN_MENU_ITEM}">
  <div class="{css CSS_MAIN_MENU_ITEM_START}">
    <div class="{css CSS_ICON} {$logo}"></div>
  </div>
  <div class="{css CSS_MAIN_MENU_ITEM_MID}">
    <div class="{css CSS_MAIN_MENU_ITEM_TEXT}">
      {$text}
    </div>
  </div>
  <div class="{css CSS_MAIN_MENU_ITEM_END}">
    {if $count > 0}
    <div class="{css CSS_MAIN_MENU_ITEM_COUNT}">
      {$count}
    </div>
    {/if}
  </div>
</a>
{/template}