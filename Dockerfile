# Используем официальный PHP образ с Apache
FROM php:8.2-apache

# Устанавливаем необходимые расширения, если нужно (например, для Faker)
RUN docker-php-ext-install pdo pdo_mysql

# Копируем весь проект в директорию веб-сервера
COPY . /var/www/html/

# Устанавливаем права, если надо
RUN chown -R www-data:www-data /var/www/html/

# Порт по умолчанию для Apache 80
EXPOSE 80

# Запускаем Apache в фореграунд режиме
CMD ["apache2-foreground"]
