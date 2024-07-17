<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\User\Models\Roles;
use Illuminate\Support\Str;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       // Seed admin role
        Roles::create([
            'name' => 'admin',
            'slug' => 'admin',
            'status' => 'active',
        ]);

        // Seed user role
        Roles::create([
            'name' => 'user',
            'slug' => 'user',
            'status' => 'active',
        ]);
    }
}
