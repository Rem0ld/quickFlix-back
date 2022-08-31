import { configJest, userService } from "..";
import { mockUser } from "../mock/mockUser";

configJest();

describe("User service", () => {
  describe("create a user", () => {
    it("should create a user", async () => {
      const [user] = await userService.create(mockUser);
      expect(user.pseudo).toBe(mockUser.pseudo);
    });

    it("should check password and return the user and the token", async () => {
      const [user] = await userService.findByPseudo("pierrotLeFou");
      const [result] = await userService.authenticate(user.pseudo, "Passw0rd");
      expect(result).toHaveProperty("token");
    });
  });
});
