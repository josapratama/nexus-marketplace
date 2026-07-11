-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nexus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexus;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `passwordHash` text,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
-- Add passwordHash if upgrading from older schema
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `passwordHash` text;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `imageUrl` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `categories_id` PRIMARY KEY(`id`),
  CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `sellerId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `categoryId` int NOT NULL,
  `imageUrl` text,
  `imageUrls` text,
  `tags` text,
  `stock` int NOT NULL DEFAULT 0,
  `rating` decimal(3,2) DEFAULT '0',
  `reviewCount` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `products_id` PRIMARY KEY(`id`),
  CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);

-- Cart items table
CREATE TABLE IF NOT EXISTS `cartItems` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `orderNumber` varchar(64) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) DEFAULT '0',
  `shipping` decimal(10,2) DEFAULT '0',
  `total` decimal(10,2) NOT NULL,
  `items` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `orders_id` PRIMARY KEY(`id`),
  CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `orderId` int NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(255),
  `comment` text,
  `helpful` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);

-- Product specifications table
CREATE TABLE IF NOT EXISTS `productSpecifications` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `specKey` varchar(255) NOT NULL,
  `specValue` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `productSpecifications_id` PRIMARY KEY(`id`)
);

-- ─────────────────────────────────────────
-- Seed: default categories
-- ─────────────────────────────────────────
INSERT IGNORE INTO `categories` (`name`, `slug`, `description`) VALUES
  ('UI Kits', 'ui-kits', 'Complete UI component kits and design systems'),
  ('Templates', 'templates', 'Ready-to-use website and app templates'),
  ('Icons', 'icons', 'Icon packs and vector assets'),
  ('Fonts', 'fonts', 'Premium typography and font families'),
  ('3D Assets', '3d-assets', '3D models, scenes, and visual assets'),
  ('Illustrations', 'illustrations', 'Vector illustrations and artwork');
