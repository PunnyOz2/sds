CREATE DATABASE IF NOT EXISTS `wordpress` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE USER IF NOT EXISTS 'wordpressuser'@'[frontend-instance-private-ip]' IDENTIFIED BY '[wordpress_db_pwd]';

GRANT ALL ON 'wordpress'.* TO 'wordpressuser'@'[frontend-instance-private-ip]';