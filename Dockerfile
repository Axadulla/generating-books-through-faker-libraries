# Базовый образ PHP с Apache
FROM php:8.2-apache

# Копируем весь проект в /var/www/html/web_application
COPY ./ /var/www/html/web_application

# Настраиваем Apache, чтобы корнем был public внутри web_application
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/web_application/public|' /etc/apache2/sites-available/000-default.conf

# Включаем модуль перезаписи URL, если нужно (часто требуется для PHP-приложений)
RUN a2enmod rewrite

# Устанавливаем права (чтобы Apache мог читать файлы)
RUN chown -R www-data:www-data /var/www/html/web_application

# Открываем порт 80 (Apache)
EXPOSE 80

# Запускаем Apache в фоновом режиме (фореграунд)
CMD ["apache2-foreground"]
