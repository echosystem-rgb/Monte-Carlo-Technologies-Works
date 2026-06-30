<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

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
        //
    })->create();