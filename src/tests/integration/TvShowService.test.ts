import { configJest, tvShowService, videoService } from "..";
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
    const [result, error] = await tvShowService.create({} as TTvShow);
    expect(error.message).toContain("missing data");
  });
});

describe("find tvShow", () => {
  it("should find a all tvShows", async () => {
    const [tvShows] = await tvShowService.findAll();
    expect(tvShows.total).toBeGreaterThanOrEqual(1);
    expect(tvShows.data.length).toBeGreaterThanOrEqual(1);
  });

  it("should find a tvShow by id", async () => {
    const [result] = await tvShowService.findAll();
    const [tvShow] = await tvShowService.findById(result.data[0].id.toString());
    expect(tvShow).toHaveProperty("name");
  });
});

describe("update tvShow", () => {
  it("should add episode to tvshow", async () => {
    const [result] = await tvShowService.findAll();
    const [video] = await videoService.create(mockVideo);
    await tvShowService.patch(result.data[0].id.toString(), {
      videos: [video as unknown as Video],
    });
    const [updated] = await tvShowService.findAll();
    console.log(
      "🚀 ~ file: TvShowService.test.ts ~ line 43 ~ it ~ updated",
      updated
    );
    expect(updated.data[0].videos).toHaveProperty("1.1.basename");
  });
});

describe("delete tvShow", () => {
  it("should delete the tvShow and update all videos referenced", async () => {
    const [tvShows] = await tvShowService.findAll();
    const [result] = await tvShowService.delete(tvShows.data[0].id.toString());

    expect(result.affected).toEqual(1);
  });
});
