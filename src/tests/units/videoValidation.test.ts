import { configJest } from "..";
import { videoSchema } from "../../modules/Video/Video.Validation";
import { TVideo } from "../../types";
import { mockVideo } from "../mock/mockVideo";

configJest();

describe("Video validation tests", () => {
  describe("Validate video", () => {
    it("should validate the video", async () => {
      const result = videoSchema.validate(mockVideo);
      expect(result.value).toMatchObject<Partial<TVideo>>(mockVideo);
    });

    it("should return error when passing a missformed video", () => {
      const result = videoSchema.validate({});
      expect(result.error).toBeTruthy();
    });
  });
});
