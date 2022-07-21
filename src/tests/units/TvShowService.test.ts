import { configJest, tvShowService } from ".";
import { TTvShow } from "../../types";
import { mockTvShow } from "../mock/mockTvShow";

configJest();

describe("create tvshow", () => {
  it("should create a tvShow", async () => {
    const tvShow = await tvShowService.create(mockTvShow);
    expect(tvShow.name).toBe(mockTvShow.name);
  });

  it("should throw an error for missing parameter", async () => {
    await expect(tvShowService.create({} as TTvShow)).rejects.toThrow(
      "missing data"
    );
  });
});

describe("find tvShow", () => {
  it("should find a all tvShows", async () => {
    const tvShows = await tvShowService.findAll();
    expect(tvShows.total).toBe(1);
    expect(tvShows.data).toHaveLength(1);
  });
  it("should find a tvShow by id", async () => {
    const tvShows = await tvShowService.findAll();
    const tvShow = await tvShowService.findById(tvShows[0].id);
    expect(tvShow).toHaveProperty("name");
  });
});

describe("update tvShow", () => {
  it("should add episode to tvshow", async () => { });
});

describe("delete tvShow", () => {
  it("should delete the tvShow and update all videos referenced", async () => { });
});
