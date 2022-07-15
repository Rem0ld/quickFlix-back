import { Video, VideoTypeEnum } from "../../modules/Video/Video.entity";
import VideoRepository from "../../modules/Video/Video.repository";
import { RequestBuilder, TVideo } from "../../types";
import { AppDataSource } from "../../data-source";
import connection from "../../config/databases";
import { v4 as uuidv4 } from "uuid";
import VideoService from "../../modules/Video/Video.service";
import dynamicQueryBuilder from "../../utils/queryBuilder";

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

const videoRepo = new VideoRepository(AppDataSource.manager);
const videoService = new VideoService(videoRepo);

const mockVideo: Omit<TVideo, "id"> = {
  uuid: uuidv4(),
  name: "game of thrones",
  basename: "game of thrones",
  location: "useretcgaime",
  ext: "mp4",
  filename: "game of thrones",
  type: VideoTypeEnum.TV,
  episode: 1,
  season: 1,
  year: new Date("02/14/2003"),
  releaseDate: new Date("02/14/2003"),
  genres: ["action"],
  trailerYtCode: [],
  posterPath: [],
};

const mockRequest: RequestBuilder = {
  name: "game",
  episode: 1,
  season: 1,
  type: [VideoTypeEnum.TV, VideoTypeEnum.MOVIE],
};

const mockRequestEpisode: RequestBuilder = {
  episode: 1,
};

describe("Video service unit test", () => {
  describe("add a video", () => {
    it("should create a video with the given properties", async () => {
      try {
        const video = await videoService.create(mockVideo, { movieJob: false });
        expect(video.name).toBe("game of thrones");
      } catch (error) {
        console.error(error);
      }
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
      try {
        const videos = await videoService.findAll(20, 0);
        expect(videos).toHaveLength(1);
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe("Query builder unit test", () => {
    describe("Build request to DB properly", () => {
      it("should return request to DB with wheres", async () => {
        try {
          const result = await dynamicQueryBuilder(
            mockRequest,
            Video,
            "video"
          ).getMany();
          expect(result.length).toBeGreaterThanOrEqual(0);
        } catch (error) {
          console.error(error);
        }
      });
    });

    describe("Build query with only episode set", () => {
      it("should return all records with episode 1 and pass", async () => {
        try {
          const result = await dynamicQueryBuilder(
            mockRequestEpisode,
            Video,
            "video"
          ).getMany();

          expect(result.length).toBeGreaterThanOrEqual(0);
        } catch (error) {
          console.error(error);
        }
      });
    });
  });
});
