import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "movies_cast" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"photo_id" integer
);

ALTER TABLE "movies" ADD COLUMN "release_date" timestamp(3) with time zone;
ALTER TABLE "movies" ADD COLUMN "producer" varchar;
ALTER TABLE "movies" ADD COLUMN "director" varchar;
CREATE INDEX IF NOT EXISTS "movies_cast_order_idx" ON "movies_cast" ("_order");
CREATE INDEX IF NOT EXISTS "movies_cast_parent_id_idx" ON "movies_cast" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "movies_cast" ADD CONSTRAINT "movies_cast_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "movies_cast" ADD CONSTRAINT "movies_cast_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "movies_cast";
ALTER TABLE "movies" DROP COLUMN IF EXISTS "release_date";
ALTER TABLE "movies" DROP COLUMN IF EXISTS "producer";
ALTER TABLE "movies" DROP COLUMN IF EXISTS "director";`)
};
