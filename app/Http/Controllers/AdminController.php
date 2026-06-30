<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use ApiResponse;

    // GET /api/admin/users (Super Admin & Admin)
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->is_admin && !$user->is_super_admin) {
            return $this->error('Unauthorized. Admin or Super Admin access required.', 403);
        }

        return $this->success(User::all());
    }

    // DELETE /api/admin/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        if ($user->is_admin || $user->is_super_admin) {
            return $this->error('Cannot delete an admin or super admin user', 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return $this->success(null, 'User deleted successfully');
    }

    // PUT /api/admin/users/{id}/make-admin
    public function makeAdmin($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        if ($user->is_super_admin) {
            return $this->error('Super Admin cannot be set as Admin', 400);
        }

        if ($user->is_admin) {
            return $this->error($user->name . ' is already an admin', 400);
        }

        $user->update(['is_admin' => true]);

        return $this->success($user, $user->name . ' is now an admin');
    }

    // PUT /api/admin/users/{id}/remove-admin
    public function removeAdmin($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        if ($user->is_super_admin) {
            return $this->error('Cannot remove Super Admin', 403);
        }

        if (!$user->is_admin) {
            return $this->error($user->name . ' is not an admin', 400);
        }

        $user->update(['is_admin' => false]);

        return $this->success($user, $user->name . ' is no longer an admin');
    }

    // PUT /api/admin/transfer-super-admin/{id}
    public function transferSuperAdmin(Request $request, $id)
    {
        $currentSuperAdmin = $request->user();
        $newSuperAdmin = User::find($id);

        if (!$newSuperAdmin) {
            return $this->error('User not found', 404);
        }

        if ($newSuperAdmin->is_super_admin) {
            return $this->error($newSuperAdmin->name . ' is already a Super Admin', 400);
        }

        $currentSuperAdmin->update([
            'is_super_admin' => false,
            'is_admin'       => false
        ]);

        $newSuperAdmin->update([
            'is_super_admin' => true,
            'is_admin'       => false
        ]);

        return $this->success($newSuperAdmin, 'Super Admin transferred to ' . $newSuperAdmin->name);
    }

    // PUT /api/admin/resign
    public function resignAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user->is_admin) {
            return $this->error('You are not an admin', 400);
        }

        $user->update(['is_admin' => false]);

        return $this->success(null, 'You have resigned as admin');
    }

    // PUT /api/admin/resign-super-admin
    public function resignSuperAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user->is_super_admin) {
            return $this->error('You are not a Super Admin', 400);
        }

        return $this->error(
            'You cannot resign as Super Admin directly. Please transfer the Super Admin role first.',
            400,
            ['action' => 'Use PUT /api/admin/transfer-super-admin/{id} to transfer your role to another user']
        );
    }
}