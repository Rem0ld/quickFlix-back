import { configJest } from ".";
import { TvShowDTO } from "../../modules/TvShow/TvShow.dto";
import { VideoDTO } from "../../modules/Video/Video.dto";
import { WatchedDTO } from "../../modules/Watched/Watched.dto";
import { mockTvShowDTO } from "../mock/mockTvShow";
import { mockVideo, mockVideoDTO } from "../mock/mockVideo";
import { mockWatched } from "../mock/mockWatched";

configJest();

describe("Watched dto testing", () => {
  it("should create a DTO object", () => {
    const dto = new WatchedDTO(mockWatched);
    expect(dto).toBeInstanceOf(WatchedDTO);
  });
});

describe("Video dto testing", () => {
  it("should create a DTO object", () => {
    const dto = new VideoDTO(mockVideoDTO);
    expect(dto).toBeInstanceOf(VideoDTO);
  });
});

describe("TvShow dto testing", () => {
  it("should create a DTO object", () => {
    const dto = new TvShowDTO(mockTvShowDTO);
    expect(dto).toBeInstanceOf(TvShowDTO);
  });
});
