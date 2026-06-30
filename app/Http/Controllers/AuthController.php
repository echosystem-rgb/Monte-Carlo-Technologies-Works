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

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success(null, 'User registered successfully', 201, [
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

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

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