DROP DATABASE IF EXISTS "quickflix_db";
CREATE DATABASE "quickflix_db";

DROP TYPE IF EXISTS "type_video" CASCADE;
CREATE TYPE "type_video" AS ENUM (
  'movie',
  'tvshow',
  'trailer'
);

DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar,
  "pasword" varchar,
  "is_admin" boolean,
  "created_at" timestamp,
  "updated_at" timestamp
);

DROP TABLE IF EXISTS "watched" CASCADE;
CREATE TABLE "watched" (
  "id" int PRIMARY KEY,
  "video_id" int,
  "user_id" int,
  "times_watched" float,
  "finished" boolean,
  "created_at" timestamp,
  "updated_at" timestamp
);

DROP TABLE IF EXISTS "videos" CASCADE;
CREATE TABLE "videos" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "basename" varchar,
  "filename" varchar,
  "ext" char,
  "location" varchar,
  "episode" varchar,
  "season" varchar,
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
  "trailer" int,
  "genres" varchar[],
  "trailer_yt_code" varchar[],
  "poster_path" varchar[],
  "tv_show_id" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

DROP TABLE IF EXISTS "tv_shows" CASCADE;
CREATE TABLE "tv_shows" (
  "id" int PRIMARY KEY,
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
  "created_at" timestamp,
  "updated_at" timestamp
);

DROP TABLE IF EXISTS "watched_tv_show" CASCADE;
CREATE TABLE "watched_tv_show" (
  "tv_show_id" int,
  "user_id" int,
  "watched_id" int,
  "created_at" timestamp,
  "updated_at" timestamp,
  PRIMARY KEY ("tv_show_id", "user_id")
);

CREATE INDEX ON "videos" ("name");

CREATE INDEX ON "videos" ("basename");

CREATE INDEX ON "videos" ("genres");

CREATE INDEX ON "tv_shows" ("name");

CREATE INDEX ON "tv_shows" ("genres");

ALTER TABLE "watched" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "watched" ADD FOREIGN KEY ("video_id") REFERENCES "videos" ("id") ON DELETE CASCADE;

ALTER TABLE "videos" ADD FOREIGN KEY ("trailer") REFERENCES "videos" ("id") ON DELETE CASCADE;

ALTER TABLE "videos" ADD FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows" ("id") ON DELETE CASCADE;

ALTER TABLE "watched_tv_show" ADD FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows" ("id") ON DELETE CASCADE;

ALTER TABLE "watched_tv_show" ADD FOREIGN KEY ("watched_id") REFERENCES "watched" ("id") ON DELETE CASCADE;

ALTER TABLE "watched_tv_show" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
