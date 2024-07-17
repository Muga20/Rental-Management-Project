<?php

namespace Modules\Homes\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class GenerateCoverPhoto implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $home;

    public function __construct($home)
    {
        $this->home = $home;
    }

    public function handle()
    {
        $backgroundColor = $this->getRandomBackgroundColor();
        $image = $this->createCoverPhoto($backgroundColor);
        $uploadedImage = Cloudinary::upload($image, ["folder" => "cover-photos"]);
        $coverPhotoUrl = $uploadedImage->getSecurePath();

        // Save the cover photo URL to the home record
        $this->home->coverPhoto = $coverPhotoUrl;
        $this->home->save();
    }

    private function getRandomBackgroundColor()
    {
        $colors = ['#FFC107', '#9C27B0', '#3F51B5', '#FF5722', '#4CAF50', '#009688', '#E91E63', '#607D8B'];
        return $colors[array_rand($colors)];
    }

    private function createCoverPhoto($backgroundColor)
    {
        $image = imagecreatetruecolor(1200, 600);
        sscanf($backgroundColor, "#%02x%02x%02x", $red, $green, $blue);
        $bgColor = imagecolorallocate($image, $red, $green, $blue);
        imagefill($image, 0, 0, $bgColor);

        // Add semi-transparent rectangles for a more dynamic background
        $numRectangles = rand(5, 15);
        for ($i = 0; $i < $numRectangles; $i++) {
            $rectColor = imagecolorallocatealpha($image, rand(0, 255), rand(0, 255), rand(0, 255), rand(50, 100));
            $rectWidth = rand(100, 400);
            $rectHeight = rand(100, 400);
            $x = rand(0, imagesx($image) - $rectWidth);
            $y = rand(0, imagesy($image) - $rectHeight);
            imagefilledrectangle($image, $x, $y, $x + $rectWidth, $y + $rectHeight, $rectColor);
        }

        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,' . base64_encode($imageData);
    }
}
