-- phpMyAdmin SQL Dump
-- Warzywniak - zmodyfikowany
-- Host: 127.0.0.1
-- Wersja serwera: 10.4.18-MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Tabela: vegetables
CREATE TABLE `vegetables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` real DEFAULT 0.0,
  `quantity` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Przykładowe dane
INSERT INTO `vegetables` (`name`, `description`, `image_url`, `price`, `quantity`) VALUES
('Marchew', 'Świeża marchew prosto z pola.', 'https://example.com/marchew.jpg', 2.99, 150),
('Ziemniak', 'Ziemniaki do gotowania i pieczenia.', 'https://example.com/ziemniak.jpg', 1.89, 300),
('Pomidor', 'Soczyste pomidory malinowe.', 'https://example.com/pomidor.jpg', 4.50, 100);

-- Tabela: weather (pozostaje bez zmian)
CREATE TABLE `weather` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `cloud_level` tinyint(4) DEFAULT NULL,
  `moon_phase` varchar(50) DEFAULT NULL,
  `precipitation` varchar(50) DEFAULT NULL,
  `fog_density` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;