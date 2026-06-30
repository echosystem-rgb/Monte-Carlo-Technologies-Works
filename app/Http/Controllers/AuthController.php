<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    // POST /api/register
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('register_token')->plainTextToken;

        return $this->success(null, 'User registered successfully. Use this token for your first login only.', 201, [
            'token' => $token,
            'user'  => $user
        ]);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials', 401);
        }

        // First login ever for this account: the register token is
        // mandatory on top of email+password.
        if (!$user->has_logged_in) {
            $bearer = $request->bearerToken();

            if (!$bearer) {
                return $this->error(
                    'First login requires the registration token. Send it as a Bearer token in the Authorization header.',
                    401
                );
            }

            // Resolve the token the same way Sanctum does internally,
            // without requiring this route to sit behind auth:sanctum.
            $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($bearer);

            if (!$accessToken
                || $accessToken->name !== 'register_token'
                || $accessToken->tokenable_id !== $user->id
                || $accessToken->tokenable_type !== get_class($user)
            ) {
                return $this->error('Invalid or expired registration token.', 401);
            }

            // Token is valid and belongs to this exact user — consume it.
            $accessToken->delete();
        }

        // Wipe any old tokens (register token if still present, or
        // previous login tokens) and issue a fresh login token.
        $user->tokens()->delete();

        if (!$user->has_logged_in) {
            $user->update(['has_logged_in' => true]);
        }

        $token = $user->createToken('login_token')->plainTextToken;

        return $this->success(null, 'Login successful', 200, [
            'token' => $token,
            'user'  => $user
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    // DELETE /api/delete-account
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        if ($user->is_super_admin) {
            return $this->error(
                'Super Admin cannot delete their account. Transfer Super Admin role first.',
                403,
                ['action' => 'Use PUT /api/admin/transfer-super-admin/{id} to transfer your role first']
            );
        }

        if ($user->is_admin) {
            return $this->error(
                'Admin cannot delete their account. Resign as Admin first.',
                403,
                ['action' => 'Use PUT /api/admin/resign to resign first']
            );
        }

        $user->tokens()->delete();
        $user->delete();

        return $this->success(null, 'Your account has been deleted successfully');
    }
}