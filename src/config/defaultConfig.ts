import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const defaultLimit = 20;

export const movieDbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_MOVIEDB}&page=1&include_adult=false&language=en-US&query=`;
export const imageDbUrl = `https://image.tmdb.org/t/p/w500`;

// Need to add id after tv/ then add the remaining of the URL
export const detailDbUrl = `https://api.themoviedb.org/3`; // tv | movie / {id}
export const apikeyUrl = `?api_key=${process.env.API_MOVIEDB}&language=en-US`;

export const basePath = path.resolve("./public");

export const excludedExtension = [
  "DS_Store",
  "nfo",
  "txt",
  "html",
  "7z",
  "zip",
  "doc",
  "db",
  "jpg",
  "jpeg",
  "png",
  "completed",
  "url",
];