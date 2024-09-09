FROM php:8.0-apache

# Instalar extensões necessárias para o MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite do Apache 
RUN a2enmod rewrite

# Copiar o código da aplicação para o diretório do Apache
COPY ../ /var/www/html/

# Ajustar permissões
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
