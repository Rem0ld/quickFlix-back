import { Video } from "../../modules/Video/Video.entity";
import { TResultService, TVideo } from "../../types";
import dynamicQueryBuilder from "../../utils/queryBuilder";
import {
  mockRequest,
  mockRequestEpisode,
  mockUpdateVideo,
  mockVideo,
} from "../mock/mockVideo";
import { configJest, videoService } from "..";

configJest();

describe("Video service unit test", () => {
  describe("add a video", () => {
    it("should create a video with the given properties", async () => {
      const [video] = await videoService.create(mockVideo);
      expect(video.name).toBe("game of thrones");
    });
  });

  describe("should miss parameter to create video", () => {
    it("should not pass", async () => {
      const [result, error] = await videoService.create({} as TVideo);
      expect(error.message).toContain("missing data");
    });
  });

  describe("get all videos", () => {
    it("should get the video we created", async () => {
      const [videos] = await videoService.findAll(20, 0, null);
      expect(videos.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Query builder unit test", () => {
    describe("Build request to DB properly", () => {
      it("should return request to DB with wheres", async () => {
        const result = await dynamicQueryBuilder(
          mockRequest,
          Video,
          "video"
        ).getMany();
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("Build query with only episode set", () => {
      it("should return all records with episode 1 and pass", async () => {
        const result = await dynamicQueryBuilder(
          mockRequestEpisode,
          Video,
          "video"
        ).getMany();

        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("Delete one video", () => {
      it("should retrieve video and delete it", async () => {
        const [result] = await videoService.findAll(20, 0, null);
        expect(result.total).toBeGreaterThanOrEqual(1);
        await videoService.deleteOneById(result.data[0].id.toString());
        const [response] = await videoService.findById(
          result.data[0].id.toString()
        );
        expect(response).toBeNull();
      });
    });
  });
});
