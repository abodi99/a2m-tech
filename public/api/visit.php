<?php
/**
 * A2M Tech – Visitor alert email.
 *
 * Called once per browser session from VisitNotifier.
 * Emails abbe.mofleh@a2m-tech.com with page, referrer and UTM data.
 *
 * Rate limits (to avoid inbox flood):
 *  - Max 1 email per IP per 3 hours
 *  - Max 30 emails total per hour
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: https://a2m-tech.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();

// Per-IP limit: 1 / 3h
$ipFile = sys_get_temp_dir() . '/a2m_visit_ip_' . md5($ip);
if (file_exists($ipFile)) {
    $last = (int) file_get_contents($ipFile);
    if (($now - $last) < 10800) {
        http_response_code(200);
        echo json_encode(['ok' => true, 'skipped' => 'ip_rate_limit']);
        exit;
    }
}

// Global limit: 30 / hour
$globalFile = sys_get_temp_dir() . '/a2m_visit_global';
$hits = [];
if (file_exists($globalFile)) {
    $hits = array_filter(
        json_decode(file_get_contents($globalFile), true) ?? [],
        fn($t) => ($now - $t) < 3600
    );
}
if (count($hits) >= 30) {
    http_response_code(200);
    echo json_encode(['ok' => true, 'skipped' => 'global_rate_limit']);
    exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

$path        = substr(trim(strip_tags($body['path'] ?? '/')), 0, 500);
$referrer    = substr(trim(strip_tags($body['referrer'] ?? '')), 0, 500);
$title       = substr(trim(strip_tags($body['title'] ?? '')), 0, 200);
$locale      = substr(trim(strip_tags($body['locale'] ?? '')), 0, 20);
$utmSource   = substr(trim(strip_tags($body['utm_source'] ?? '')), 0, 100);
$utmMedium   = substr(trim(strip_tags($body['utm_medium'] ?? '')), 0, 100);
$utmCampaign = substr(trim(strip_tags($body['utm_campaign'] ?? '')), 0, 100);
$utmContent  = substr(trim(strip_tags($body['utm_content'] ?? '')), 0, 100);
$utmTerm     = substr(trim(strip_tags($body['utm_term'] ?? '')), 0, 100);
$screen      = substr(trim(strip_tags($body['screen'] ?? '')), 0, 40);
$ua          = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);
$when        = date('Y-m-d H:i:s');

$adminEmail = 'abbe.mofleh@a2m-tech.com';
$subject    = "Nytt besök på a2m-tech.com – {$path}";

$mailBody = <<<TEXT
Nytt besök på a2m-tech.com
==========================
Tid:          {$when}
Sida:         {$path}
Titel:        {$title}
Referrer:     {$referrer}
Språk:        {$locale}
Skärm:        {$screen}
UTM source:   {$utmSource}
UTM medium:   {$utmMedium}
UTM campaign: {$utmCampaign}
UTM content:  {$utmContent}
UTM term:     {$utmTerm}
IP:           {$ip}
User-Agent:   {$ua}

Dashboard: https://umami.volontera.se
TEXT;

$headers  = "From: noreply@a2m-tech.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail(
    $adminEmail,
    function_exists('mb_encode_mimeheader')
        ? mb_encode_mimeheader($subject, 'UTF-8', 'Q')
        : $subject,
    $mailBody,
    $headers
);

file_put_contents($ipFile, (string) $now);
$hits[] = $now;
file_put_contents($globalFile, json_encode(array_values($hits)));

http_response_code(200);
echo json_encode(['ok' => true, 'emailed' => (bool) $sent]);
