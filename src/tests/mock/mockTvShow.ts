import { TTvShow } from "../../types";
import { v4 as uuidv4 } from "uuid";

export const mockTvShow: Omit<TTvShow, "id"> = {
  uuid: uuidv4(),
  name: "Game of thrones",
  location: "/somewhere/on/the/hardrive",
  ongoing: false,
  averageLength: 5000,
  firstAirDate: new Date("02/14/2003"),
  genres: ["action"],
  numberEpisode: 68,
  numberSeason: 8,
};

export const mockTvShowDTO: TTvShow = {
  id: 1,
  uuid: uuidv4(),
  name: "Game of thrones",
  location: "/somewhere/on/the/hardrive",
  ongoing: false,
  averageLength: 5000,
  firstAirDate: new Date("02/14/2003"),
  genres: ["action"],
  numberEpisode: 68,
  numberSeason: 8,
};
