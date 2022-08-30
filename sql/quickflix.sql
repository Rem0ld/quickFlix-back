
DROP TYPE IF EXISTS "type_video" CASCADE;
CREATE TYPE "type_video" AS ENUM (
  'movie',
  'tv',
  'trailer',
  'teaser'
);

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "pseudo" varchar(40) UNIQUE,
  "email" varchar,
  "password" varchar,
  "is_admin" boolean,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "watched" CASCADE;
CREATE TABLE "watched"(
  "id" SERIAL UNIQUE,
  "video_id" int,
  "user_id" int,
  "times_watched" float DEFAULT 0.00,
  "finished" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now(),
  PRIMARY KEY ("video_id", "user_id")
);

DROP TABLE IF EXISTS "video" CASCADE;
CREATE TABLE "video" (
  "id" SERIAL PRIMARY KEY,
  "uuid" varchar,
  "name" varchar,
  "basename" varchar,
  "filename" varchar,
  "ext" varchar(3),
  "location" varchar,
  "episode" integer,
  "season" integer,
  "year" date,
  "release_date" date,
  "type" type_video,
  "score" int,
  "resume" varchar,
  "length" float,
  "id_movie_db" varchar,
  "directors" varchar[],
  "writers" varchar[],
  "actors" varchar[],
  "video_id_ref" int,
  "genres" varchar[],
  "trailer_yt_code" varchar[],
  "poster_path" varchar[],
  "tv_show_id" int,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "tv_show" CASCADE;
CREATE TABLE "tv_show" (
  "id" SERIAL PRIMARY KEY,
  "uuid" varchar,
  "id_movie_db" varchar,
  "name" varchar,
  "location" varchar,
  "number_episode" int,
  "number_season" int,
  "ongoing" boolean,
  "origin_country" varchar[],
  "poster_path" varchar[],
  "resume" varchar[],
  "score" int,
  "genres" varchar[],
  "first_air_date" timestamp,
  "trailer_yt_code" varchar[],
  "average_length" float,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "encoding_job" CASCADE;
CREATE TABLE "encoding_job" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar,
  "type" varchar,
  "path" varchar,
  "errors" varchar[],
  "video_id" int,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "movie_db_job" CASCADE;
CREATE TABLE "movie_db_job" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar,
  "type" varchar,
  "video_id" int,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

CREATE INDEX ON "video" ("name");

CREATE INDEX ON "video" ("basename");

CREATE INDEX ON "video" ("genres");

CREATE INDEX ON "video" ("uuid");

CREATE INDEX ON "tv_show" ("name");

CREATE INDEX ON "tv_show" ("genres");

CREATE INDEX ON "tv_show" ("uuid");

CREATE INDEX ON "encoding_job" ("type");

CREATE INDEX ON "encoding_job" ("status");

CREATE INDEX ON "movie_db_job" ("status");

CREATE INDEX ON "movie_db_job" ("type");


ALTER TABLE "watched" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;

ALTER TABLE "watched" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("id") ON DELETE CASCADE;

ALTER TABLE "video" ADD FOREIGN KEY ("video_id_ref") REFERENCES "video" ("id") ON DELETE SET NULL;

ALTER TABLE "video" ADD FOREIGN KEY ("tv_show_id") REFERENCES "tv_show" ("id") ON DELETE SET NULL;

ALTER TABLE "encoding_job" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("id") ON DELETE CASCADE;

ALTER TABLE "movie_db_job" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("id") ON DELETE CASCADE;
