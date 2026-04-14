CREATE TABLE `ate_fases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ateId` int NOT NULL,
	`numeroFase` int NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`contenido` json NOT NULL,
	`completada` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ate_fases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`grado` varchar(100),
	`competencia` text,
	`tipo` enum('producto','proceso','sistema') NOT NULL,
	`descripcion` text,
	`estado` enum('borrador','en_progreso','completada') NOT NULL DEFAULT 'borrador',
	`ultimaFaseCompletada` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plantillas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`tipo` enum('producto','proceso','sistema') NOT NULL,
	`descripcion` text,
	`contenido` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plantillas_id` PRIMARY KEY(`id`)
);
