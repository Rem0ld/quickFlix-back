import { configJest, tvShowService, videoService } from ".";
import { Video } from "../../modules/Video/Video.entity";
import { TTvShow } from "../../types";
import { mockTvShow } from "../mock/mockTvShow";
import { mockVideo, mockVideo2 } from "../mock/mockVideo";

configJest();

describe("create tvshow", () => {
  it("should create a tvShow", async () => {
    const [result] = await tvShowService.create(mockTvShow);
    expect(result.name).toBe(mockTvShow.name);
  });

  it("should throw an error for missing parameter", async () => {
    await expect(tvShowService.create({} as TTvShow)).rejects.toThrow(
      "missing data"
    );
  });
});

describe("find tvShow", () => {
  it("should find a all tvShows", async () => {
    const [tvShows] = await tvShowService.findAll();
    expect(tvShows.total).toBe(1);
    expect(tvShows.data).toHaveLength(1);
  });

  it("should find a tvShow by id", async () => {
    const [result] = await tvShowService.findAll();
    const tvShow = await tvShowService.findById(result.data[0].id.toString());
    expect(tvShow).toHaveProperty("name");
  });
});

describe("update tvShow", () => {
  it("should add episode to tvshow", async () => {
    const [result] = await tvShowService.findAll();
    const video = await videoService.create(mockVideo);
    await tvShowService.patch(result.data[0].id.toString(), {
      videos: [video as unknown as Video],
    });
    const [updated] = await tvShowService.findAll();
    expect(updated.data[0].videos).toHaveLength(1);
  });
});

describe("delete tvShow", () => {
  it("should delete the tvShow and update all videos referenced", async () => {
    const [tvShows] = await tvShowService.findAll();
    const [result] = await tvShowService.delete(tvShows[0].id.toString());

    expect(result.affected).toEqual(1);
  });
});
