<?php
/**
 * ForwardWeb lead endpoint. Receives the apply and audit forms and mails Max.
 *
 * - Validates on the server (the browser checks are a courtesy).
 * - Honeypot field "company": real visitors never see it, bots fill it.
 * - File-based per-IP rate limit: 5 sends per hour.
 * - No secrets live here. PHP mail() uses the host's mail setup.
 * - JSON for the in-page form (Accept: application/json), redirect to /thanks/ for the no-JS form.
 */

declare(strict_types=1);

const TO = 'maksut890@gmail.com';
const FROM = 'info@forwardweb.ca';
const MAX_PER_HOUR = 5;

const BUDGETS = ['Under $2,500', '$2,500 to $5,000', '$5,000 to $12,000', '$12,000+', 'Not sure yet'];
const STARTS = ['This month', 'Next 1 to 3 months', 'Just exploring'];
const BOOKINGS = ['Yes, bookings or enquiries', 'No, it is information only', 'Not sure'];

$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json');

function respond(bool $wantsJson, int $status, bool $ok, string $message): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
        exit;
    }
    if ($ok) {
        header('Location: /thanks/', true, 303);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>That did not send | ForwardWeb</title><meta name="robots" content="noindex">'
        . '<body style="font:18px/1.5 system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 16px">'
        . '<h1 style="font-size:1.6rem">That did not send.</h1><p>' . $safe . '</p>'
        . '<p><a href="/apply/">Back to the form</a> or email <a href="mailto:' . FROM . '">' . FROM . '</a>.</p></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond($wantsJson, 405, false, 'This address only accepts the form.');
}

/** Trim, drop control characters (keeps newlines in free text), cap length. */
function field(string $name, int $max, bool $multiline = false): string
{
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = $multiline
        ? (string) preg_replace('/[^\P{C}\n]+/u', '', str_replace("\r\n", "\n", $v))
        : (string) preg_replace('/\p{C}+/u', ' ', $v);
    $v = trim($v);
    return mb_substr($v, 0, $max);
}

// Honeypot: say thanks and send nothing.
if (field('company', 200) !== '') {
    respond($wantsJson, 200, true, 'Got it.');
}

// Rate limit by IP, kept in the system temp directory.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'fw_lead_' . hash('sha256', $ip) . '.json';
$now = time();
$fh = @fopen($file, 'c+');
$stamps = [];
if ($fh !== false && flock($fh, LOCK_EX)) {
    $raw = stream_get_contents($fh);
    $decoded = $raw ? json_decode($raw, true) : [];
    $stamps = array_values(array_filter(is_array($decoded) ? $decoded : [], fn ($t) => is_int($t) && $t > $now - 3600));
    if (count($stamps) >= MAX_PER_HOUR) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond($wantsJson, 429, false, 'That is a lot of messages from one connection. Wait a little, then try again.');
    }
}

$type = field('type', 10) === 'audit' ? 'audit' : 'apply';
$url = field('url', 300);
$email = field('email', 200);
$msg = field('msg', 3000, true);
$source = field('source', 200);
$score = field('score', 120);
$fixes = field('fixes', 1500, true);
$budget = field('budget', 40);
$timeline = field('timeline', 40);
$bookings = field('bookings', 60);

if (!preg_match('~^(https?://)?[^\s./]+(\.[^\s./]+)+(/\S*)?$~i', $url)) {
    respond($wantsJson, 422, false, 'Enter your website address, like yourbusiness.ca.');
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    respond($wantsJson, 422, false, 'Enter an email I can reply to, like name@company.com.');
}
if ($budget !== '' && !in_array($budget, BUDGETS, true)) { $budget = ''; }
if ($timeline !== '' && !in_array($timeline, STARTS, true)) { $timeline = ''; }
if ($bookings !== '' && !in_array($bookings, BOOKINGS, true)) { $bookings = ''; }

$subject = ($type === 'audit' ? 'Audit request' : 'New enquiry') . ': ' . mb_substr($url, 0, 80);
$lines = [
    'Type: ' . ($type === 'audit' ? 'Audit request' : 'Apply / book a call'),
    'Website: ' . $url,
    'Email: ' . $email,
];
if ($budget !== '') { $lines[] = 'Budget: ' . $budget; }
if ($timeline !== '') { $lines[] = 'Start: ' . $timeline; }
if ($bookings !== '') { $lines[] = 'Takes bookings or leads online: ' . $bookings; }
if ($score !== '') { $lines[] = 'AI visibility check: ' . $score; }
if ($fixes !== '') { $lines[] = "Fixes it suggested:\n" . $fixes; }
$lines[] = 'Sent from: ' . ($source !== '' ? $source : 'unknown');
$lines[] = '';
$lines[] = $msg !== '' ? "Notes:\n" . $msg : 'Notes: (none)';
$body = implode("\n", $lines) . "\n";

$headers = [
    'From: ForwardWeb <' . FROM . '>',
    'Reply-To: ' . $email, // validated above, so no header injection
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: forwardweb-lead',
];
$sent = @mail(TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . FROM);

if ($fh !== false) {
    if ($sent) {
        $stamps[] = $now;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($stamps));
    }
    flock($fh, LOCK_UN);
    fclose($fh);
}

if (!$sent) {
    respond($wantsJson, 500, false, 'The mail server refused it.');
}
respond($wantsJson, 200, true, 'Got it.');
