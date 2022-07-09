import VideoService from "../../modules/Video/Video.service";
import { Video, VideoTypeEnum } from "../../modules/Video/Video.entity";
import VideoRepository from "../../modules/Video/Video.repository";
import { TVideo } from "../../types";
import { AppDataSource } from "../../data-source";
import connection from "../../config/databases";

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

const videoRepo = new VideoRepository(AppDataSource.manager);
const videoService = new VideoService(videoRepo);

const mockVideo: Partial<TVideo> = {
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
      await expect(videoService.create({}, { movieJob: false })).rejects.toThrowError("invalid video object, missing name");

    });
  });

  describe("get all videos", () => {
    it("should get the video we created", async () => {
      try {
        const videos = await videoService.find({ limit: 20, skip: 0 })
        console.log(videos)
        expect(videos).toHaveLength(1)
      } catch (error) {
        console.log(error)
      }
    })
  })
});
