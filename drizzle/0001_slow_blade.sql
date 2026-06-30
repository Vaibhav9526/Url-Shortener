ALTER TABLE "users" ADD COLUMN "first_name" varchar(55) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(55);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "user_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lastname";