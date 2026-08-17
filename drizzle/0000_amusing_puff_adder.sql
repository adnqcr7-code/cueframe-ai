CREATE TABLE `transcriptSegments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` varchar(32) NOT NULL,
	`segmentIndex` int NOT NULL,
	`startMs` int NOT NULL,
	`endMs` int NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transcriptSegments_id` PRIMARY KEY(`id`),
	CONSTRAINT `transcript_segments_video_index_unique` UNIQUE(`videoId`,`segmentIndex`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` varchar(32) NOT NULL,
	`sourceUrl` varchar(512) NOT NULL,
	`title` varchar(512),
	`durationSeconds` int,
	`language` varchar(16) NOT NULL DEFAULT 'en',
	`transcriptStatus` enum('ready','unavailable','error') NOT NULL DEFAULT 'ready',
	`transcriptSource` varchar(64),
	`fetchedAt` timestamp,
	`expiresAt` timestamp,
	`lastError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`),
	CONSTRAINT `videos_video_id_unique` UNIQUE(`videoId`)
);
--> statement-breakpoint
CREATE INDEX `transcript_segments_video_idx` ON `transcriptSegments` (`videoId`);--> statement-breakpoint
CREATE INDEX `videos_expires_idx` ON `videos` (`expiresAt`);