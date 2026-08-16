<?php
/**
 * Copy to subscribe.config.php on the server (never commit real credentials).
 * Used by subscribe.php to sync new subscribers into Coolify Listmonk.
 *
 * In Listmonk: Settings → API → create API user + token
 * Then create a list (e.g. "A2M Tech Insights") and note its numeric ID.
 */
return [
    'listmonk_url'  => 'https://YOUR-LISTMONK-DOMAIN',
    'listmonk_user' => 'api_user',
    'listmonk_pass' => 'api_token',
    'listmonk_list' => 1,
];
