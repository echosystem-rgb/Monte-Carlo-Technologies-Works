<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    use ApiResponse;

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Allow both Admin and Super Admin
        if (!$user || (!$user->is_admin && !$user->is_super_admin)) {
            return $this->error('Unauthorized. Admin access only.', 403);
        }

        return $next($request);
    }
}