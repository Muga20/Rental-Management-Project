<?php

namespace Modules\User\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class GenerateCoverPhoto implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userDetails;

    public function __construct($userDetails)
    {
        $this->userDetails = $userDetails;
    }

    public function handle()
    {
        $image = $this->createCoverPhoto();
        $uploadedImage = Cloudinary::upload($image, ["folder" => "cover-photos"]);
        $coverPhotoUrl = $uploadedImage->getSecurePath();

        // Save the cover photo URL to the userDetails record
        $this->userDetails->coverPhoto = $coverPhotoUrl;
        $this->userDetails->save();
    }

    private function createCoverPhoto()
    {
        // Create a new image canvas
        $image = imagecreatetruecolor(1200, 600);

        // Generate a random background color
        $backgroundColor = $this->getRandomBackgroundColor();
        sscanf($backgroundColor, "#%02x%02x%02x", $red, $green, $blue);
        $bgColor = imagecolorallocate($image, $red, $green, $blue);
        imagefill($image, 0, 0, $bgColor);

        // Add semi-transparent geometric shapes
        $numShapes = rand(10, 20);
        for ($i = 0; $i < $numShapes; $i++) {
            $shapeColor = imagecolorallocatealpha($image, rand(0, 255), rand(0, 255), rand(0, 255), rand(50, 100));
            $shapeType = rand(1, 3); // Randomly choose shape type: 1 = rectangle, 2 = ellipse, 3 = polygon

            switch ($shapeType) {
                case 1: // Rectangle
                    $rectWidth = rand(50, 200);
                    $rectHeight = rand(50, 200);
                    $x = rand(0, imagesx($image) - $rectWidth);
                    $y = rand(0, imagesy($image) - $rectHeight);
                    imagefilledrectangle($image, $x, $y, $x + $rectWidth, $y + $rectHeight, $shapeColor);
                    break;
                case 2: // Ellipse (circle)
                    $circleRadius = rand(50, 150);
                    $cx = rand($circleRadius, imagesx($image) - $circleRadius);
                    $cy = rand($circleRadius, imagesy($image) - $circleRadius);
                    imagefilledellipse($image, $cx, $cy, $circleRadius * 2, $circleRadius * 2, $shapeColor);
                    break;
                case 3: // Polygon (triangle)
                    $numPoints = 3; // triangles have 3 points
                    $points = [];
                    for ($j = 0; $j < $numPoints; $j++) {
                        $points[] = rand(0, imagesx($image)); // x-coordinate
                        $points[] = rand(0, imagesy($image)); // y-coordinate
                    }
                    imagefilledpolygon($image, $points, $numPoints, $shapeColor);
                    break;
            }
        }

        // Output the image data as base64 encoded PNG
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,' . base64_encode($imageData);
    }

    private function getRandomBackgroundColor()
    {
        $colors = ['#FFC107', '#9C27B0', '#3F51B5', '#FF5722', '#4CAF50', '#009688', '#E91E63', '#607D8B'];
        return $colors[array_rand($colors)];
    }
}
