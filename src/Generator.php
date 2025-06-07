<?php
namespace App;

use Faker\Factory;

class Generator
{
    private $faker;

    public function __construct(string $locale, int $seed)
    {
        $this->faker = Factory::create($locale);
        $this->faker->seed($seed);
    }

    public function generateBook(int $index): array
    {
        return [
            'index'     => $index,
            'isbn'      => $this->faker->isbn13(),
            'title'     => $this->faker->sentence(3),
            'authors'   => [$this->faker->name()],
            'publisher' => $this->faker->company(),
        ];
    }
}
