-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 17-05-2023 a las 00:06:17
-- Versión del servidor: 8.0.33-0ubuntu0.22.04.2
-- Versión de PHP: 8.1.2-1ubuntu2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Compra`
--

CREATE TABLE `Compra` (
  `IdCompra` int NOT NULL,
  `FechaCompra` date NOT NULL,
  `TotalCompra` decimal(10,2) NOT NULL,
  `Pago` decimal(10,2) NOT NULL,
  `Cambio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Compra`
--

INSERT INTO `Compra` (`IdCompra`, `FechaCompra`, `TotalCompra`, `Pago`, `Cambio`) VALUES
(1, '2023-05-10', '74.00', '200.00', '126.00'),
(2, '2023-04-29', '3.00', '3.00', '0.00');

--
-- Disparadores `Compra`
--
DELIMITER $$
CREATE TRIGGER `calcular_cambio` BEFORE INSERT ON `Compra` FOR EACH ROW BEGIN
    SET NEW.Cambio = NEW.TotalCompra - NEW.Pago;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DetallesCompra`
--

CREATE TABLE `DetallesCompra` (
  `IdCompra` int NOT NULL,
  `IdProducto` int NOT NULL,
  `Cantidad` int NOT NULL,
  `PrecioProducto` decimal(10,2) NOT NULL,
  `Descuento` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `DetallesCompra`
--

INSERT INTO `DetallesCompra` (`IdCompra`, `IdProducto`, `Cantidad`, `PrecioProducto`, `Descuento`) VALUES
(1, 1, 2, '34.00', '0.00'),
(1, 2, 1, '1.50', '0.00'),
(1, 3, 3, '1.50', '0.00'),
(2, 2, 2, '1.50', '0.00');

--
-- Disparadores `DetallesCompra`
--
DELIMITER $$
CREATE TRIGGER `update_precio_producto` BEFORE INSERT ON `DetallesCompra` FOR EACH ROW BEGIN
    SET NEW.PrecioProducto = (SELECT precio FROM producto WHERE id = NEW.IdProducto);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `proveedor_id` int DEFAULT NULL,
  `totalProducto` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `precio`, `proveedor_id`, `totalProducto`) VALUES
(1, 'Coca-Cola', 'Refresco de cola', '4.00', 1, 100),
(2, 'Pepsi', 'Refresco de cola', '1.50', 1, 80),
(3, 'Sprite', 'Refresco de lima-limón', '1.50', 1, 50),
(4, 'Fanta', 'Refresco de naranja', '1.50', 2, 120),
(5, 'Powerade', 'Bebida isotónica', '2.00', 2, 70),
(6, 'Aquafina', 'Agua purificada', '1.00', 2, 200),
(7, 'Galletas Oreo', 'Galletas rellenas de crema', '2.50', 3, 50),
(8, 'Doritos', 'Botana de tortilla de maíz', '1.75', 3, 100),
(9, 'Cheetos', 'Botana de queso', '1.50', 3, 80),
(10, 'Lays', 'Papas fritas', '1.50', 3, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id` int NOT NULL,
  `nombre_empresa` varchar(255) NOT NULL,
  `nombre_contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id`, `nombre_empresa`, `nombre_contacto`, `telefono`, `email`) VALUES
(1, 'Coca-Cola Company', 'John Smith', '555-1238', 'john.smith@coca-cola.com'),
(2, 'Pepsi Company', 'Jane Doe', '555-5678', 'jane.doe@pepsi.com'),
(3, 'Frito-Lay', 'Mike Johnson', '555-9876', 'mike.johnson@frito-lay.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'user1', '1234', 'user'),
(2, 'admin1', '1234', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Compra`
--
ALTER TABLE `Compra`
  ADD PRIMARY KEY (`IdCompra`);

--
-- Indices de la tabla `DetallesCompra`
--
ALTER TABLE `DetallesCompra`
  ADD PRIMARY KEY (`IdCompra`,`IdProducto`),
  ADD KEY `IdProducto` (`IdProducto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedor_id` (`proveedor_id`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Compra`
--
ALTER TABLE `Compra`
  MODIFY `IdCompra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `DetallesCompra`
--
ALTER TABLE `DetallesCompra`
  ADD CONSTRAINT `DetallesCompra_ibfk_1` FOREIGN KEY (`IdCompra`) REFERENCES `Compra` (`IdCompra`) ON DELETE CASCADE,
  ADD CONSTRAINT `DetallesCompra_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
