<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class ClearUserCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-user {userId : The ID of the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the cache for a specific user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $userId = $this->argument('userId');
        $redisKey = 'user:' . $userId;

        if (Redis::exists($redisKey)) {
            Redis::del($redisKey);
            $this->info("User cache for user ID {$userId} has been cleared.");
        } else {
            $this->info("No cache found for user ID {$userId}.");
        }

        return 0;
    }
}
