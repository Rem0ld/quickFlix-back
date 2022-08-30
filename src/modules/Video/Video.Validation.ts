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
  episode: Joi.number(),
  season: Joi.number(),
  year: Joi.date(),
  releaseDate: Joi.date(),
  type: Joi.string().allow(
    VideoTypeEnum.MOVIE,
    VideoTypeEnum.TEASER,
    VideoTypeEnum.TRAILER,
    VideoTypeEnum.TV
  ),
  score: Joi.number(),
  resume: Joi.string(),
  length: Joi.number(),
  idMovieDb: Joi.string(),
  directors: Joi.array().items(Joi.string()),
  writers: Joi.array().items(Joi.string()),
  actors: Joi.array().items(Joi.string()),
  genres: Joi.array().items(Joi.string()),
  trailerYtCode: Joi.array().items(Joi.string()),
  posterPath: Joi.array().items(Joi.string()),
});
