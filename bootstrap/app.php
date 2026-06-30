<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Note: IsAdmin and IsSuperAdmin are referenced directly via
        // ::class in routes/api.php, so no alias registration is needed
        // here. 'auth:sanctum' is built in and works automatically.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        /**
         * Status text map duplicated from App\Traits\ApiResponse.
         * Kept in sync manually — this closure runs before a controller
         * or middleware is resolved, so it can't `use` the trait directly.
         * If you add a new code to the trait's map, add it here too.
         */
        $statusText = function (int $code): string {
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
        };

        $jsonError = function (string $message, int $code, array $extra = []) use ($statusText) {
            return response()->json(array_merge([
                'status'  => $code . ' ' . $statusText($code),
                'success' => false,
                'message' => $message,
            ], $extra), $code);
        };

        // No/invalid/expired Sanctum token
        $exceptions->render(function (AuthenticationException $e, Request $request) use ($jsonError) {
            if ($request->is('api/*')) {
                return $jsonError('Unauthenticated. Please log in to continue.', 401);
            }
        });

        // $request->validate([...]) failures in any controller
        $exceptions->render(function (ValidationException $e, Request $request) use ($jsonError) {
            if ($request->is('api/*')) {
                return $jsonError(
                    'The given data was invalid.',
                    422,
                    ['errors' => $e->errors()]
                );
            }
        });

        // URL doesn't match any defined route
        $exceptions->render(function (NotFoundHttpException $e, Request $request) use ($jsonError) {
            if ($request->is('api/*')) {
                return $jsonError('The requested endpoint does not exist.', 404);
            }
        });

        // Route exists but wrong HTTP verb used (e.g. PATCH on a PUT-only route)
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) use ($jsonError) {
            if ($request->is('api/*')) {
                return $jsonError('This HTTP method is not allowed for this endpoint.', 405);
            }
        });
    })->create();