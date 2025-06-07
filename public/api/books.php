<?php
require_once __DIR__ . '/../../vendor/autoload.php';


use Faker\Factory;


header('Content-Type: application/json');

// Получаем параметры из запроса
$seed = $_GET['seed'] ?? 'default';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$lang = $_GET['lang'] ?? 'en_US';
$likesAvg = isset($_GET['likes']) ? (float)$_GET['likes'] : 0.0;
$reviewsAvg = isset($_GET['reviews']) ? (float)$_GET['reviews'] : 0.0;

$batchSize = isset($_GET['batchSize']) ? (int)$_GET['batchSize'] : 10;


$combinedSeed = crc32($seed) + $page;
mt_srand($combinedSeed);


$faker = Factory::create($lang);
$faker->seed($combinedSeed);


function generateIsbn(): string {
    return '978-' . mt_rand(100, 999) . '-' . mt_rand(1000000, 9999999);
}



function generateReviews($faker): array {
    $count = mt_rand(1, 5);
    $reviews = [];

    for ($i = 0; $i < $count; $i++) {
        $reviews[] = [
            'text' => $faker->sentence(mt_rand(5, 12)),
            'author' => $faker->name(),
            'company' => $faker->company(),
        ];
    }

    return $reviews;
}

$books = [];

for ($i = 0; $i < $batchSize; $i++) {
    $numAuthors = mt_rand(1, 2);
    $authors = [];
    $coverUrl = "https://picsum.photos/seed/book{$seed}-{$page}-{$i}/120/180";

    for ($j = 0; $j < $numAuthors; $j++) {
        $authors[] = $faker->name();
    }

    $hasLikes = mt_rand() / mt_getrandmax() < ($likesAvg - floor($likesAvg)) ? ceil($likesAvg) : floor($likesAvg);

    $hasReviews = mt_rand() / mt_getrandmax() < ($reviewsAvg - floor($reviewsAvg)) ? ceil($reviewsAvg) : floor($reviewsAvg);

    $books[] = [
        'isbn' => generateIsbn(),
        'title' => $faker->sentence(mt_rand(2, 5)),
        'authors' => $authors,
        'publisher' => $faker->company() . ', ' . $faker->year(),
        'likes' => $hasLikes,
        'reviews' => $hasReviews ? generateReviews($faker) : [],
        'cover' => $coverUrl,
    ];
}


echo json_encode($books);

