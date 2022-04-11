import path from "path";
import fetch from "node-fetch";
import { downloadImage, fileExists } from "../utils/fileManipulation";
import { detailDbUrl, apikeyUrl, imageDbUrl } from "../config/defaultConfig";
import { VideoType } from "../types";

/**
 * Fetch details for a tvShow
 * @param {String} id TheMovieDb id
 * @returns Object {genres, ongoing, numberSeason, numberEpisode, originCountry}
 */
export async function getTvShowDetails(id: string) {
  try {
    const response = await fetch(`${detailDbUrl}/tv/${id}${apikeyUrl}`);
    const result = await response.json();
    if (!result) return {};

    return {
      genres: result.genres.map((el: { name: string, id: number }) => el.name),
      ongoing: result.in_production,
      numberSeason: result.number_of_seasons,
      numberEpisode: result.number_of_episodes,
      originCountry: result.origin_country,
    };
  } catch (error) {
    return {};
  }
}

/**
 * Fetch genres for a movie
 * @param {String} id of the video on TheMovieDBApi
 * @returns genres of the video
 */
export async function getGenres(id: string) {
  try {
    const response = await fetch(`${detailDbUrl}/movie/${id}${apikeyUrl}`);
    const result = await response.json();
    if (!result) return [];

    return result.genres.map((genre: { name: string, id: number }) => genre.name);
  } catch (error) {
    return [];
  }
}

/**
 * Fetch trailers and teasers youtube key for a video
 * @param {String} id of the video on theMovieDBApi
 * @param {String} type enum tv | movie | trailer | teaser
 * @returns String[] of youtube key
 */
export async function getVideoPath(id: string, type: VideoType) {
  try {
    const response = await fetch(`${detailDbUrl}/${type}/${id}/videos${apikeyUrl}`);
    const { results } = await response.json();
    if (!results) return [];

    let result = [],
      i = 0;

    while (i < results.length && result.length < 5) {
      if (results[i].type.includes("Teaser") || results[i].type.includes("Trailer")) {
        result.push(results[i].key);
      }
      i++;
    }

    return result;
  } catch (error) {
    return [];
  }
}

/**
 * Check if an image already exists
 * Download the image if doesn't exists
 * @param {String} filepath name of the file + extension
 * @returns the path of the image or undefined
 */
export async function getImages(filepath: string): Promise<void> {
  console.log("🚀 ~ file: apiService.ts ~ line 82 ~ getImages ~ filepath", filepath)

  const basePath = "./public/images";
  const imagePath = `${basePath}/${filepath}`;

  if (!fileExists(imagePath)) {
    console.log("🚀 ~ file: apiService.ts ~ line 88 ~ getImages ~ !fileExists(imagePath)", !fileExists(imagePath))
    downloadImage(imageDbUrl + filepath, imagePath);
  }
  return undefined
}
