-- Create the database
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE `User` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(191) NOT NULL,
  `last_name` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(191),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` VARCHAR(191),
  `location` VARCHAR(191)
);

CREATE TABLE `Stock` (
  `stock_id` INT AUTO_INCREMENT PRIMARY KEY,
  `symbol` VARCHAR(191) NOT NULL,
  `company_name` VARCHAR(191) NOT NULL,
  `current_price` DOUBLE NOT NULL,
  `last_updated` DATETIME,
  `exchange` VARCHAR(191),
  `volume` VARCHAR(191),
  `sector` VARCHAR(191),
  `market_cap` VARCHAR(191),
  `company_info` VARCHAR(191),
  `in_list` BOOLEAN
);

CREATE TABLE `Order` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `stock_id` INT NOT NULL,
  `order_type` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL,
  `price_per_share` DOUBLE NOT NULL,
  `total_value` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `duration` VARCHAR(191)
);

CREATE TABLE `Holding` (
  `holding_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `stock_id` INT NOT NULL,
  `holding_number` INT NOT NULL,
  `average_price` DOUBLE NOT NULL,
  `cash` INT NOT NULL,
  `total_value` INT NOT NULL,
  `last_updated` DATETIME
);

CREATE TABLE `Watchlist` (
  `watchlist_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `stock_id` INT NOT NULL,
  `display_name` VARCHAR(191),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  -- `stock_list` JSON -- 如需复杂结构可自行添加
);

CREATE TABLE `NetWorth` (
  `net_worth_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_balance` DOUBLE NOT NULL,
  `stock_value` DOUBLE NOT NULL,
  `date_recorded` DATETIME NOT NULL
); 