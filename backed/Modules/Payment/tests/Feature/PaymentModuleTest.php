<?php

namespace Modules\Payment\tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentModuleTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function testExample(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
