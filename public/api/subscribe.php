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
$page   = trim(strip_tags($body['page']   ?? ''));
$utmSource   = trim(strip_tags($body['utm_source']   ?? ''));
$utmMedium   = trim(strip_tags($body['utm_medium']   ?? ''));
$utmCampaign = trim(strip_tags($body['utm_campaign'] ?? ''));

// ── Validate email ─────────────────────────────────────────────────────────
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

// ── Append to CSV subscriber list ─────────────────────────────────────────
// File is stored in a writable directory outside webroot when possible.
// On Hostinger, /tmp is writable; adjust path to a private dir if available.
$csvPath = sys_get_temp_dir() . '/a2m_subscribers.csv';
$isNew   = !file_exists($csvPath);

$row = [
    date('Y-m-d H:i:s'),
    $email,
    $locale,
    $source,
    $page,
    $utmSource,
    $utmMedium,
    $utmCampaign,
    $_SERVER['REMOTE_ADDR'] ?? '',
];

$fp = fopen($csvPath, 'a');
if ($fp) {
    if ($isNew) {
        fputcsv($fp, ['timestamp', 'email', 'locale', 'source', 'page',
                      'utm_source', 'utm_medium', 'utm_campaign', 'ip']);
    }
    fputcsv($fp, $row);
    fclose($fp);
}

// ── Notify admin ───────────────────────────────────────────────────────────
$adminEmail = 'abbe.mofleh@a2m-tech.com';
$adminSubject = "Ny prenumerant – {$email}";
$adminBody = <<<TEXT
Ny prenumerant på a2m-tech.com
==============================
E-post:       {$email}
Språk:        {$locale}
Källa:        {$source}
Sida:         {$page}
UTM source:   {$utmSource}
UTM medium:   {$utmMedium}
UTM campaign: {$utmCampaign}
IP:           {$_SERVER['REMOTE_ADDR']}
Tid:          {$row[0]}
TEXT;

$headers  = "From: noreply@a2m-tech.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($adminEmail, mb_encode_mimeheader($adminSubject, 'UTF-8', 'Q'), $adminBody, $headers);

// ── Respond ────────────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode(['ok' => true]);
