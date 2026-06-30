<?php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, $message = null, $code = 200, $extra = [])
    {
        $response = [
            'status'  => $code,
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
            'status'  => $code,
            'success' => false,
            'message' => $message,
        ], $extra);

        return response()->json($response, $code);
    }
}