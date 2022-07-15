import connection from "../../config/databases";
import { AppDataSource } from "../../data-source";
import UserRepository from "../../modules/User/User.repository";
import UserService from "../../modules/User/User.service";
import { TUser } from "../../types";

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

const userRepo = new UserRepository(AppDataSource.manager)
const userService = new UserService(userRepo)

const mockUser: Omit<TUser, "id"> = {
  pseudo: "pierrotLeFou",
  email: "p.lovergne@hotmail.fr",
  password: "Passw0rd",
  isAdmin: false,
}

describe("User service", () => {
  describe("create a user", () => {
    it("should create a user", async () => {
      try {
        const user = await userService.create(mockUser);
      } catch (error) {
        console.error(error)
      }
    })
  })
})