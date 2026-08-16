<?php
/**
 * Deprecated: visit emails disabled by request.
 * Kept as a no-op stub in case an old client still calls this endpoint.
 */
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo json_encode(['ok' => true, 'disabled' => true]);
