import connection from "../../config/databases";
import { AppDataSource } from "../../data-source";
import { User } from "../../modules/User/User.entity";
import UserRepository from "../../modules/User/User.repository";
import UserService from "../../modules/User/User.service";
import { TUser } from "../../types";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.clear();
  await connection.close();
});

const userRepo = new UserRepository(AppDataSource.manager);
const userService = new UserService(userRepo);

const mockUser: Omit<TUser, "id"> = {
  pseudo: "pierrotLeFou",
  email: "p.lovergne@hotmail.fr",
  password: "Passw0rd",
  isAdmin: false,
};

describe("User service", () => {
  describe("create a user", () => {
    it("should create a user", async () => {
      const user: User = await userService.create(mockUser);
      expect(user.pseudo).toBe(mockUser.pseudo);
    });

    it("should check password and return the user and the token", async () => {
      const user = await userService.findByPseudo("pierrotLeFou");
      const result = await userService.authenticate(
        user.pseudo,
        "Passw0rd"
      );
      expect(result).toHaveProperty("token");
    });
  });
});
