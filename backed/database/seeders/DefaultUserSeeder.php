<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Company\Models\Company;
use Modules\User\Models\Roles;
use Modules\User\Models\User;
use Modules\User\Models\UserDetails;
use Modules\User\Models\UserRoles;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $company = Company::firstOrCreate([
            'companyId' => 'cm00001',
            'name' => 'House Management System',
            'status' => 'active',
            'slug' => 'house-management-system',
        ]);

        $user = User::create([
            'email' => 'sudo@sudo.com',
            'password' => Hash::make('123456789'),
            'status' => 'active',
            'authType' => 'password',
            'company_id' => $company->id,
        ]);

        UserDetails::create([
            'user_id' => $user->id,
            'first_name' => 'sudo',
            'last_name' => 'user',
            'is_verified' => 'true'
        ]);

        $roles = Roles::whereIn('slug', ['admin', 'user'])->get();

        foreach ($roles as $role) {
            UserRoles::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
            ]);
        }
    }
}
