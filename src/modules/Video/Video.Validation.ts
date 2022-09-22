import Joi from "joi";
import { VideoTypeEnum } from "./Video.entity";

export const videoSchema = Joi.object({
  name: Joi.string().required(),
  uuid: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .allow(),
  basename: Joi.string().required(),
  filename: Joi.string().required(),
  ext: Joi.string().max(5).required(),
  location: Joi.string().required(),
  episode: Joi.number().allow(null),
  season: Joi.number().allow(null),
  year: Joi.date().allow(null),
  releaseDate: Joi.date().allow(null),
  type: Joi.string().allow(
    VideoTypeEnum.MOVIE,
    VideoTypeEnum.TEASER,
    VideoTypeEnum.TRAILER,
    VideoTypeEnum.TV
  ),
  score: Joi.number().allow(null),
  resume: Joi.string().allow(null),
  length: Joi.number().allow(null),
  idMovieDb: Joi.string().allow(null),
  directors: Joi.array().items(Joi.string()),
  writers: Joi.array().items(Joi.string()),
  actors: Joi.array().items(Joi.string()),
  genres: Joi.array().items(Joi.string()),
  trailerYtCode: Joi.array().items(Joi.string()),
  posterPath: Joi.array().items(Joi.string()),
  tvShow: Joi.any(),
});

export const patchVideoSchema = Joi.object({
  name: Joi.string(),
  uuid: Joi.string()
    .guid({
      version: "uuidv4",
    })
    .allow(),
  basename: Joi.string(),
  filename: Joi.string(),
  ext: Joi.string().max(5),
  location: Joi.string(),
  episode: Joi.number().allow(null),
  season: Joi.number().allow(null),
  year: Joi.date().allow(null),
  releaseDate: Joi.date().allow(null),
  type: Joi.string().allow(
    VideoTypeEnum.MOVIE,
    VideoTypeEnum.TEASER,
    VideoTypeEnum.TRAILER,
    VideoTypeEnum.TV
  ),
  score: Joi.number().allow(null),
  resume: Joi.string().allow(null),
  length: Joi.number().allow(null),
  idMovieDb: Joi.string().allow(null),
  directors: Joi.array().items(Joi.string()),
  writers: Joi.array().items(Joi.string()),
  actors: Joi.array().items(Joi.string()),
  genres: Joi.array().items(Joi.string()),
  trailerYtCode: Joi.array().items(Joi.string()),
  posterPath: Joi.array().items(Joi.string()),
  tvShow: Joi.any(),
});
