import { configJest, tvShowService, videoService } from ".";
import { TTvShow } from "../../types";
import { mockTvShow } from "../mock/mockTvShow";
import { mockVideo, mockVideo2 } from "../mock/mockVideo";

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
    const { data } = await tvShowService.findAll();
    const tvShow = await tvShowService.findById(data[0].id.toString());
    expect(tvShow).toHaveProperty("name");
  });
});

describe("update tvShow", () => {
  it("should add episode to tvshow", async () => {
    const { data: tvShows } = await tvShowService.findAll();
    const video = await videoService.create(mockVideo, { movieJob: false })
    await tvShowService.update(tvShows[0].id.toString(), { videos: [video] })
    const updated = await tvShowService.findAll()
    expect(updated.data[0].videos).toHaveLength(1)
  });
});

describe("delete tvShow", () => {
  it("should delete the tvShow and update all videos referenced", async () => {
    const { data: tvShows } = await tvShowService.findAll();
    console.log("🚀 ~ file: TvShowService.test.ts ~ line 48 ~ it ~ tvShows", tvShows)
    const result = await tvShowService.delete(tvShows[0].id.toString())
    console.log("🚀 ~ file: TvShowService.test.ts ~ line 50 ~ it ~ result", result)

  });
});
