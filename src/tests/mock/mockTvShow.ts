import { TTvShow } from "../../types";

export const mockTvShow: Omit<TTvShow, "id"> = {
  name: "Game of thrones",
  location: "/somewhere/on/the/hardrive",
  ongoing: false,
  averageLength: 5000,
  firstAirDate: new Date("02/14/2003"),
  genres: ["action"],
  numberEpisode: 68,
  numberSeason: 8
}