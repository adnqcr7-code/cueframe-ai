ALTER TABLE `transcriptSegments` DROP INDEX `transcript_segments_video_index_unique`;--> statement-breakpoint
ALTER TABLE `videos` DROP INDEX `videos_video_id_unique`;--> statement-breakpoint
DROP INDEX `transcript_segments_video_idx` ON `transcriptSegments`;--> statement-breakpoint
ALTER TABLE `transcriptSegments` ADD `language` varchar(16) DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE `transcriptSegments` ADD CONSTRAINT `transcript_segments_video_language_index_unique` UNIQUE(`videoId`,`language`,`segmentIndex`);--> statement-breakpoint
ALTER TABLE `videos` ADD CONSTRAINT `videos_video_language_unique` UNIQUE(`videoId`,`language`);--> statement-breakpoint
CREATE INDEX `transcript_segments_video_language_idx` ON `transcriptSegments` (`videoId`,`language`);