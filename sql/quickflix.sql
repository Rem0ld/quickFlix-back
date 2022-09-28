CREATE DATABASE db_quickflix;

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "pseudo" varchar(40) UNIQUE,
  "email" varchar,
  "password" varchar,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "watched" CASCADE;
CREATE TABLE "watched"(
  "id" SERIAL UNIQUE,
  "video_id" uuid,
  "user_id" id,
  "time_watched" float DEFAULT 0.00,
  "finished" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now(),
  PRIMARY KEY ("video_id", "user_id")
);

DROP TABLE IF EXISTS "video" CASCADE;
CREATE TABLE "video" (
  "id" SERIAL, 
  "uuid" uuid PRIMARY KEY,
  "name" varchar,
  "basename" varchar,
  "filename" varchar,
  "ext" varchar,
  "location" varchar,
  "episode" integer,
  "season" integer,
  "year" date,
  "release_date" date,
  "type" varchar,
  "score" real,
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
  "tv_show_id" uuid,
  "movie_db_job_id" int,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "tv_show" CASCADE;
CREATE TABLE "tv_show" (
  "id" SERIAL,
  "uuid" uuid PRIMARY KEY,
  "id_movie_db" varchar,
  "name" varchar,
  "location" varchar,
  "number_episode" int,
  "number_season" int,
  "ongoing" boolean,
  "origin_country" varchar[],
  "poster_path" varchar[],
  "resume" varchar,
  "score" real,
  "genres" varchar[],
  "first_air_date" timestamp,
  "trailer_yt_code" varchar[],
  "average_length" float,
  "movie_db_job_id" int,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "encoding_job" CASCADE;
CREATE TABLE "encoding_job" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar DEFAULT 'todo',
  "type" varchar,
  "path" varchar,
  "errors" varchar[],
  "video_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

DROP TABLE IF EXISTS "movie_db_job" CASCADE;
CREATE TABLE "movie_db_job" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar DEFAULT 'todo',
  "type" varchar,
  "errors" varchar[] NULL,
  "video_id" uuid NULL,
  "tv_show_id" uuid NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT  now()
);

CREATE INDEX ON "video" ("name");

CREATE INDEX ON "video" ("basename");

CREATE INDEX ON "video" ("genres");

CREATE INDEX ON "tv_show" ("name");

CREATE INDEX ON "tv_show" ("genres");

CREATE INDEX ON "encoding_job" ("type");

CREATE INDEX ON "encoding_job" ("status");

CREATE INDEX ON "movie_db_job" ("status");

CREATE INDEX ON "movie_db_job" ("type");


ALTER TABLE "watched" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "watched" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("uuid");

ALTER TABLE "video" ADD FOREIGN KEY ("video_id_ref") REFERENCES "video" ("uuid");

ALTER TABLE "video" ADD FOREIGN KEY ("tv_show_id") REFERENCES "tv_show" ("uuid");

ALTER TABLE "video" ADD FOREIGN KEY ("movie_db_job_id") REFERENCES "movie_db_job" ("id");

ALTER TABLE "tv_show" ADD FOREIGN KEY ("movie_db_job_id") REFERENCES "movie_db_job" ("id");

ALTER TABLE "encoding_job" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("uuid");

ALTER TABLE "movie_db_job" ADD FOREIGN KEY ("video_id") REFERENCES "video" ("uuid");

ALTER TABLE "movie_db_job" ADD FOREIGN KEY ("tv_show_id") REFERENCES "tv_show" ("uuid");