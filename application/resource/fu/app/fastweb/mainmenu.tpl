{namespace tpl.fu.app.fastweb.MainMenu}

/**
 * Template.
 * @param id
 */
{template .element}
<div id="{$id}_element"  class="{css CSS_MAIN_MENU}">
  <div id="{$id}_content"></div>
</div>
{/template}


/**
 * Template.
 * @param id
 * @param accessToken
 * @param user
 * @param groups
 * @param friendlists
 */
{template .asyncElement}
<div id="{$id}_asyncElement">
  {call .user_item}
    {param user: $user /}
    {param accessToken: $accessToken /}
  {/call}

  {call .caption}
    {param text: 'Favorites' /}
  {/call}

  {call .icon_item}
    {param icon : 'news_feed' /}
    {param text : 'News Feed' /}
    {param href : '/home' /}
  {/call}

  {call .icon_item}
    {param icon : 'messages' /}
    {param text : 'Messages' /}
    {param href : '/messages' /}
  {/call}

  {call .icon_item}
    {param icon : 'places' /}
    {param text : 'Nearby' /}
    {param href : '/places' /}
  {/call}

  {call .icon_item}
    {param icon : 'events' /}
    {param text : 'Events' /}
    {param href : '/events' /}
  {/call}

  {call .icon_item}
    {param icon : 'friends' /}
    {param text : 'Friends' /}
    {param href : '/friends' /}
  {/call}

  {if $groups['data']}
    {if length($groups['data']) > 0}
      {call .caption}
        {param text: 'Groups' /}
      {/call}
      {foreach $group in $groups['data']}
        {call .user_item}
          {param user: $group /}
          {param accessToken: $accessToken /}
        {/call}
      {/foreach}
    {/if}
  {/if}

  {if $friendlists['data']}
    {if length($friendlists['data']) > 0}
      {call .caption}
        {param text: 'Lists' /}
      {/call}
      {foreach $friendlist in $friendlists['data']}
        {call .icon_item}
          {param icon: 'list' /}
          {param text: $friendlist['name'] /}
          {param href: '/friendlist?id=' + $friendlist['id'] /}
        {/call}
      {/foreach}
    {/if}
  {/if}

  {call .caption}
    {param text: 'Apps' /}
  {/call}

  {call .icon_item}
    {param icon : 'photos' /}
    {param text : 'Photos' /}
    {param href : '/photos' /}
  {/call}

  {call .icon_item}
    {param icon : 'notes' /}
    {param text : 'Notes' /}
    {param href : '/notes' /}
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
<a href="{$href}"
   class="{css CSS_MAIN_MENU_LINK_ITEM} {css CSS_MAIN_MENU_ITEM}">
  {$text}
</a>
{/template}


/**
 * template.
 * @param user
 * @param accessToken
 */
{template .user_item }
<a href="/profile/{$user['id']}"
   class="{css CSS_MAIN_MENU_ICON_ITEM} {css CSS_MAIN_MENU_ITEM}">
  <div class="{css CSS_MAIN_MENU_ITEM_START}">
    {if $user['id']}
      {call .user_icon}
        {param uid: $user['id'] /}
        {param accessToken: $accessToken /}
      {/call}
    {elseif $user['uid']}
      {call .user_icon}
        {param uid: $user['uid'] /}
        {param accessToken: $accessToken /}
      {/call}
    {/if}
  </div>
  <div class="{css CSS_MAIN_MENU_ITEM_MID}">
    <div class="{css CSS_MAIN_MENU_ITEM_TEXT}">
      {$user['name']}
    </div>
  </div>
  {if $user['unread']}
  <div class="{css CSS_MAIN_MENU_ITEM_END}">
    <div class="{css CSS_MAIN_MENU_ITEM_COUNT}">
      {$user['unread']}
    </div>
  </div>
  {/if}
</a>
{/template}


/**
 * template.
 * @param icon
 * @param text
 * @param href
 * @param count
 */
{template .icon_item }
<a href="{$href}" class="{css CSS_MAIN_MENU_ICON_ITEM} {css CSS_MAIN_MENU_ITEM}">
  <div class="{css CSS_MAIN_MENU_ITEM_START}">
    <div class="{css CSS_ICON} {$icon}"></div>
  </div>
  <div class="{css CSS_MAIN_MENU_ITEM_MID}">
    <div class="{css CSS_MAIN_MENU_ITEM_TEXT}">
      {$text}
    </div>
  </div>
  {if $count > 0}
  <div class="{css CSS_MAIN_MENU_ITEM_END}">
    <div class="{css CSS_MAIN_MENU_ITEM_COUNT}">
      {$count}
    </div>
  </div>
  {/if}
</a>
{/template}

/**
 * template.
 * @param uid
 * @param accessToken
 */
{template .user_icon }
<div
  class="{css CSS_ICON}"
  style="background-image:url(
    https://graph.facebook.com/{$uid}/picture?access_token={$accessToken})">
</div>
{/template}

