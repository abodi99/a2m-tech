<?php
/**
 * A2M Tech – Newsletter / mailing-list subscription handler.
 *
 * Accepts POST { email, source?, locale? }
 * - Appends subscriber to a CSV log (readable for imports to Listmonk / Mailchimp)
 * - Sends a notification email to the admin
 * - Rate-limited: max 3 attempts per IP per hour
 *
 * Deploy this file alongside static files on Hostinger.
 * Access via: https://a2m-tech.com/api/subscribe.php
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

// ── Rate limiting ──────────────────────────────────────────────────────────
$rateFile = sys_get_temp_dir() . '/a2m_sub_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$now      = time();
$window   = 3600;
$maxHits  = 3;

$hits = [];
if (file_exists($rateFile)) {
    $hits = array_filter(
        json_decode(file_get_contents($rateFile), true) ?? [],
        fn($t) => ($now - $t) < $window
    );
}
if (count($hits) >= $maxHits) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limited']);
    exit;
}
$hits[] = $now;
file_put_contents($rateFile, json_encode(array_values($hits)));

// ── Parse body ─────────────────────────────────────────────────────────────
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

$email  = strtolower(trim(strip_tags($body['email']  ?? '')));
$source = trim(strip_tags($body['source'] ?? 'unknown'));
$locale = in_array($body['locale'] ?? '', ['sv', 'en']) ? $body['locale'] : 'sv';
$page        = substr(trim(strip_tags($body['page'] ?? '')), 0, 500);
$landing     = substr(trim(strip_tags($body['landing'] ?? '')), 0, 500);
$referrer    = substr(trim(strip_tags($body['referrer'] ?? '')), 0, 500);
$language    = substr(trim(strip_tags($body['language'] ?? '')), 0, 40);
$timezone    = substr(trim(strip_tags($body['timezone'] ?? '')), 0, 60);
$screen      = substr(trim(strip_tags($body['screen'] ?? '')), 0, 40);
$utmSource   = substr(trim(strip_tags($body['utm_source'] ?? '')), 0, 100);
$utmMedium   = substr(trim(strip_tags($body['utm_medium'] ?? '')), 0, 100);
$utmCampaign = substr(trim(strip_tags($body['utm_campaign'] ?? '')), 0, 100);
$utmContent  = substr(trim(strip_tags($body['utm_content'] ?? '')), 0, 100);
$utmTerm     = substr(trim(strip_tags($body['utm_term'] ?? '')), 0, 100);
$gclid       = substr(trim(strip_tags($body['gclid'] ?? '')), 0, 200);
$fbclid      = substr(trim(strip_tags($body['fbclid'] ?? '')), 0, 200);
$msclkid     = substr(trim(strip_tags($body['msclkid'] ?? '')), 0, 200);
$ip          = $_SERVER['REMOTE_ADDR'] ?? '';
$ua          = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

// ── Validate email ─────────────────────────────────────────────────────────
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

// ── Append to CSV subscriber list ─────────────────────────────────────────
$csvPath = sys_get_temp_dir() . '/a2m_subscribers.csv';
$isNew   = !file_exists($csvPath);
$when    = date('Y-m-d H:i:s');

$row = [
    $when, $email, $locale, $source, $page, $landing, $referrer,
    $utmSource, $utmMedium, $utmCampaign, $utmContent, $utmTerm,
    $gclid, $fbclid, $msclkid, $language, $timezone, $screen, $ip,
];

$fp = fopen($csvPath, 'a');
if ($fp) {
    if ($isNew) {
        fputcsv($fp, [
            'timestamp', 'email', 'locale', 'source', 'page', 'landing', 'referrer',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'gclid', 'fbclid', 'msclkid', 'language', 'timezone', 'screen', 'ip',
        ]);
    }
    fputcsv($fp, $row);
    fclose($fp);
}

// ── Optional: forward to Listmonk (Coolify) ────────────────────────────────
$listmonkOk = null;
$configPath = __DIR__ . '/subscribe.config.php';
if (is_readable($configPath)) {
    $cfg = include $configPath;
    if (is_array($cfg)
        && !empty($cfg['listmonk_url'])
        && !empty($cfg['listmonk_user'])
        && !empty($cfg['listmonk_pass'])
        && !empty($cfg['listmonk_list'])
    ) {
        $payload = json_encode([
            'email'  => $email,
            'name'   => '',
            'status' => 'enabled',
            'lists'  => [(int) $cfg['listmonk_list']],
            'attribs'=> array_filter([
                'source'       => $source,
                'locale'       => $locale,
                'page'         => $page,
                'landing'      => $landing,
                'referrer'     => $referrer,
                'utm_source'   => $utmSource,
                'utm_medium'   => $utmMedium,
                'utm_campaign' => $utmCampaign,
                'utm_content'  => $utmContent,
                'utm_term'     => $utmTerm,
                'gclid'        => $gclid,
                'fbclid'       => $fbclid,
                'msclkid'      => $msclkid,
                'language'     => $language,
                'timezone'     => $timezone,
                'screen'       => $screen,
            ], fn($v) => $v !== '' && $v !== null),
        ]);
        $ch = curl_init(rtrim($cfg['listmonk_url'], '/') . '/api/subscribers');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_USERPWD        => $cfg['listmonk_user'] . ':' . $cfg['listmonk_pass'],
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_TIMEOUT        => 8,
        ]);
        $resp = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $listmonkOk = ($code === 200 || $code === 409);
    }
}

// ── Notify admin ───────────────────────────────────────────────────────────
$adminEmail = 'abbe.mofleh@a2m-tech.com';
$adminSubject = "Ny prenumerant – {$email}";
$listmonkLine = $listmonkOk === null
    ? 'Listmonk: ej konfigurerad'
    : ($listmonkOk ? 'Listmonk: synkad till A2M Tech Insights' : 'Listmonk: misslyckades (CSV sparad)');
$adminBody = <<<TEXT
Ny prenumerant på a2m-tech.com
==============================
E-post:         {$email}
Språk (site):   {$locale}
Källa (form):   {$source}
Sida:           {$page}
Landningssida:  {$landing}
Referrer:       {$referrer}
Språk (browser):{$language}
Tidszon:        {$timezone}
Skärm:          {$screen}
UTM source:     {$utmSource}
UTM medium:     {$utmMedium}
UTM campaign:   {$utmCampaign}
UTM content:    {$utmContent}
UTM term:       {$utmTerm}
gclid:          {$gclid}
fbclid:         {$fbclid}
msclkid:        {$msclkid}
IP:             {$ip}
User-Agent:     {$ua}
Tid:            {$when}
{$listmonkLine}

Listmonk: https://lm.volontera.se
Umami:    https://umami.volontera.se
TEXT;

$headers  = "From: noreply@a2m-tech.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($adminEmail, mb_encode_mimeheader($adminSubject, 'UTF-8', 'Q'), $adminBody, $headers);

// ── Respond ────────────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode(['ok' => true, 'listmonk' => $listmonkOk]);
