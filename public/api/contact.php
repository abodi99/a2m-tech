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

Namn:          {$name}
Organisation:  {$org}
Kontaktuppgift:{$contact}

Meddelande:
{$message}

---
Skickat: {$now}
IP: {$_SERVER['REMOTE_ADDR']}
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
