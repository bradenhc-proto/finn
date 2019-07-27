--
-- TRANSACTIONS MICROSERVICE PERSISTENCE
--

CREATE DATABASE `transactions`;

USE `transactions`;

CREATE TABLE IF NOT EXISTS `transaction` (
        `t_id` UUID PRIMARY KEY NOT NULL,
        `t_type` INT NOT NULL REFERENCES `transaction_type` (`tt_id`),
        `t_details` TEXT,
        `t_source_a_id` UUID,
        `t_target_a_id` UUID NOT NULL,
        `t_unit_amount` INT NOT NULL,
        `t_date_time` INT
);

CREATE TABLE IF NOT EXISTS `transaction_type` (
        `tt_id` INT PRIMARY KEY NOT NULL,
        `tt_name` STRING (16)
);

--
-- ACCOUNTS MICROSERVICE PERSISTENCE
--

CREATE DATABASE `accounts`;

USE `accounts`;

CREATE TABLE IF NOT EXISTS `account` (
        `a_id` UUID PRIMARY KEY NOT NULL,
        `a_name` STRING (256) NOT NULL,
        `a_currency` STRING (8) NOT NULL,
        `a_unit_amount` INT NOT NULL
);

--
-- USERS MICROSERVICE PERSISTENCE
--

CREATE DATABASE `users`;

USE `users`;

CREATE TABLE IF NOT EXISTS `user` (
        `u_id` UUID PRIMARY KEY NOT NULL,
        `auth_id` UUID NOT NULL,
        `u_username` STRING (128) NOT NULL,
        `u_name` STRING (256) NOT NULL,
        `u_email` STRING (256) NOT NULL,
        `u_is_email_verified` BOOLEAN NOT NULL
);

