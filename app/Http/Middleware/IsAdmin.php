<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Allow both Admin and Super Admin
        if (!$user || (!$user->is_admin && !$user->is_super_admin)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }

        return $next($request);
    }
}