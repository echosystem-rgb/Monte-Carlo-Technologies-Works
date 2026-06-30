<?php

namespace App\Traits;

trait ApiResponse
{
    /**
     * Map of HTTP status codes to their standard reason phrases.
     * Covers all codes currently used across the controllers
     * (200, 201, 400, 401, 403, 404) plus the other common ones
     * you'll likely hit later (422, 429, 500, etc.).
     */
    protected function statusText(int $code): string
    {
        $map = [
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            409 => 'Conflict',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            503 => 'Service Unavailable',
        ];

        return $map[$code] ?? 'Unknown Status';
    }

    /**
     * Builds the "status" field value, e.g. "200 OK", "401 Unauthorized".
     */
    protected function formatStatus(int $code): string
    {
        return $code . ' ' . $this->statusText($code);
    }

    protected function success($data = null, $message = null, $code = 200, $extra = [])
    {
        $response = [
            'status'  => $this->formatStatus($code),
            'success' => true,
        ];

        if ($message !== null) {
            $response['message'] = $message;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json(array_merge($response, $extra), $code);
    }

    protected function error($message, $code = 400, $extra = [])
    {
        $response = array_merge([
            'status'  => $this->formatStatus($code),
            'success' => false,
            'message' => $message,
        ], $extra);

        return response()->json($response, $code);
    }
}