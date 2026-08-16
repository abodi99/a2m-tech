<?php
/**
 * A2M Tech – Contact form handler
 * Deployed alongside static files on Hostinger.
 * POSTed by /components/contact/contact-form.tsx
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Rate limit: max 5 submissions per IP per hour (simple file-based)
$rateFile = sys_get_temp_dir() . '/a2m_rate_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$now = time();
$window = 3600;
$maxHits = 5;

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

// Parse JSON body
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

// Sanitize & validate
$name    = trim(strip_tags($body['name']    ?? ''));
$org     = trim(strip_tags($body['organization'] ?? ''));
$contact = trim(strip_tags($body['contact'] ?? ''));
$message = trim(strip_tags($body['message'] ?? ''));

$page        = substr(trim(strip_tags($body['page'] ?? '')), 0, 500);
$landing     = substr(trim(strip_tags($body['landing'] ?? '')), 0, 500);
$referrer    = substr(trim(strip_tags($body['referrer'] ?? '')), 0, 500);
$locale      = substr(trim(strip_tags($body['locale'] ?? '')), 0, 20);
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
$ua          = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);
$ip          = $_SERVER['REMOTE_ADDR'] ?? '';

if (empty($name) || strlen($name) > 200) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_name']);
    exit;
}
if (empty($contact) || strlen($contact) > 200) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_contact']);
    exit;
}
if (empty($message) || strlen($message) < 10 || strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_message']);
    exit;
}

// Primary contact mailbox
$toEmail   = 'abbe.mofleh@a2m-tech.com';
$toName    = 'A2M Tech';
$fromEmail = 'noreply@a2m-tech.com';

$subject = "Ny förfrågan via a2m-tech.com – {$name}";

$body = <<<TEXT
Ny förfrågan via kontaktformuläret på a2m-tech.com
===================================================

Namn:           {$name}
Organisation:   {$org}
Kontaktuppgift: {$contact}

Meddelande:
{$message}

--- Attribution ---
Sida:           {$page}
Landningssida:  {$landing}
Referrer:       {$referrer}
Språk (site):   {$locale}
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
Skickat:        {$now}

Umami: https://umami.volontera.se
TEXT;

$headers  = "From: {$fromEmail}\r\n";
$headers .= "Reply-To: {$contact}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: A2M-Contact/1.0\r\n";

$sent = mail(
    "{$toName} <{$toEmail}>",
    mb_encode_mimeheader($subject, 'UTF-8', 'Q'),
    $body,
    $headers
);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed']);
    exit;
}

http_response_code(200);
echo json_encode(['ok' => true]);
