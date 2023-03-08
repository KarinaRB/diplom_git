-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Мар 08 2023 г., 13:08
-- Версия сервера: 10.4.27-MariaDB
-- Версия PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `grammar`
--

-- --------------------------------------------------------

--
-- Структура таблицы `rule`
--

CREATE TABLE `rule` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `grammar` text NOT NULL,
  `startSymbol` varchar(1) NOT NULL,
  `endSymbol` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `rule`
--

INSERT INTO `rule` (`id`, `user_id`, `name`, `grammar`, `startSymbol`, `endSymbol`) VALUES
(1, 1, 'gram1', 'E::=TA\nA::=+TA\nA::=-\nT::=PD\nD::=*PD\nD::=-\nP::=i\nP::=(E)', 'E', '-'),
(3, 1, 'test2', 'S::=TR\nR::=-\nR::=+TR\nR::=_TR\nT::=EF\nF::=-\nF::=*EF\nF::=/EF\nE::=(S)\nE::=a\nE::=b', 'S', '-');

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` enum('Пользователь','Администратор') NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `name`, `role`, `password`) VALUES
(1, 'ramizova_k', 'Пользователь', '$2a$10$urS77uSHJMKn8xa0GzNjn.0Zu8KZEjRjsEuO6i..LiViN0R6e5x0y'),
(2, 'test1', 'Администратор', '$2a$10$Y971zZuoKnhP8rRHuHMPGOa9Rd2sWFgtQImSlwSIF6Lktww0oTp2m'),
(3, 'test2', 'Администратор', '$2a$10$4Nppa9zCwpokAQoYAAW1ne4zqRWmTf/lC0UZ1/5cGmBKa9TiXskhW'),
(7, 'test5', 'Администратор', '$2a$10$QeLUIhjUHX6XLSP.9neLxOqw8ggn5lc6Nw3mEvE1k6Xevz5Fwb/2.');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `rule`
--
ALTER TABLE `rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `rule`
--
ALTER TABLE `rule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `rule`
--
ALTER TABLE `rule`
  ADD CONSTRAINT `rule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
