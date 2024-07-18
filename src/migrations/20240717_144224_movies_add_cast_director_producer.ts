import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "movies_producers" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar
);

CREATE TABLE IF NOT EXISTS "movies_directors" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar
);

CREATE INDEX IF NOT EXISTS "movies_producers_order_idx" ON "movies_producers" ("_order");
CREATE INDEX IF NOT EXISTS "movies_producers_parent_id_idx" ON "movies_producers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "movies_directors_order_idx" ON "movies_directors" ("_order");
CREATE INDEX IF NOT EXISTS "movies_directors_parent_id_idx" ON "movies_directors" ("_parent_id");
ALTER TABLE "movies" DROP COLUMN IF EXISTS "producer";
ALTER TABLE "movies" DROP COLUMN IF EXISTS "director";
DO $$ BEGIN
 ALTER TABLE "movies_producers" ADD CONSTRAINT "movies_producers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "movies_directors" ADD CONSTRAINT "movies_directors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "movies_producers";
DROP TABLE "movies_directors";
ALTER TABLE "movies" ADD COLUMN "producer" varchar;
ALTER TABLE "movies" ADD COLUMN "director" varchar;`)
};
