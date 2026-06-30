<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class IsSuperAdmin
{
    use ApiResponse;

    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_super_admin) {
            return $this->error('Unauthorized. Super Admin access only.', 403);
        }

        return $next($request);
    }
}