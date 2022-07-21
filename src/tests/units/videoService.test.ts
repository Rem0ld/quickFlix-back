import { Video } from "../../modules/Video/Video.entity";
import { TResultService, TVideo } from "../../types";
import dynamicQueryBuilder from "../../utils/queryBuilder";
import {
  mockRequest,
  mockRequestEpisode,
  mockUpdateVideo,
  mockVideo,
} from "../mock/mockVideo";
import { configJest, videoService } from ".";

configJest();

describe("Video service unit test", () => {
  describe("add a video", () => {
    it("should create a video with the given properties", async () => {
      const video = await videoService.create(mockVideo, { movieJob: false });
      expect(video.name).toBe("game of thrones");
    });
  });

  describe("should miss parameter to create video", () => {
    it("should not pass", async () => {
      await expect(
        videoService.create({} as TVideo, { movieJob: false })
      ).rejects.toThrowError("invalid video object, missing name");
    });
  });

  describe("get all videos", () => {
    it("should get the video we created", async () => {
      const videos = await videoService.findAll(20, 0);
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

    describe("Update one video", () => {
      it("should update video with the given properties", async () => {
        const { data }: TResultService<Video> = await videoService.findByFields(
          {
            name: "game of thrones",
          }
        );
        const result = await videoService.patch(
          data[0].id.toString(),
          mockUpdateVideo
        );
        // expect(result.affected).toBe(1);
        const video: Video = await videoService.findById(data[0].id.toString());

        expect(video.basename).toBe("game");
      });
    });

    describe("Delete one video", () => {
      it("should retrieve video and delete it", async () => {
        const video = await videoService.findAll(20, 0);
        expect(video.total).toBeGreaterThanOrEqual(1);
        await videoService.deleteOneById(video.data[0].id.toString());
        const result = await videoService.findById(video.data[0].id.toString());
        expect(result).toBeNull();
      });
    });
  });
});
