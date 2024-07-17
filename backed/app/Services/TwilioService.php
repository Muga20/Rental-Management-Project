<?php

namespace App\Services;

use Twilio\Rest\Client;

class TwilioService
{
    protected $client;
    protected $defaultCountryCode;

    public function __construct()
    {
        $this->client = new Client(config('twilio.sid'), config('twilio.token'));
        $this->defaultCountryCode = config('app.default_country_code');
    }

    public function verifyPhoneNumber($phoneNumber)
    {
        try {
            // Add default country code if missing
            if (!preg_match('/^\+/', $phoneNumber)) {
                $phoneNumber = $this->defaultCountryCode . $phoneNumber;
            }

            $phoneNumber = $this->client->lookups->v1->phoneNumbers($phoneNumber)->fetch([
                "type" => ["carrier"]
            ]);
            return $phoneNumber->carrier['error_code'] === null;
        } catch (\Exception $e) {
            return false;
        }
    }
}
