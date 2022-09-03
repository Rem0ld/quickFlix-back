import { User } from "./User.entity";
import UserRepository from "./User.repository";
import jwt from "jsonwebtoken";
import { UserDTO } from "./User.dto";
import { promisifier } from "../../services/promisifier";
import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { Result, TResultService, TUserWithToken } from "../../types";

export default class UserService {
  repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async findAll(
    limit: number,
    skip: number
  ): Promise<Result<TResultService<UserDTO>, Error>> {
    if (limit === 0) {
      skip = 0;
    }
    const [result, error] = await promisifier<TResultService<UserDTO>>(
      this.repo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }
    return ok(result);
  }

  async findByPseudo(pseudo: string): Promise<Result<UserDTO, Error>> {
    if (!pseudo.length) {
      return err(new MissingDataPayloadException("pseudo"));
    }

    const [result, error] = await promisifier<UserDTO>(
      this.repo.findByPseudo(pseudo)
    );
    if (error || !Object.keys(result).length) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async create(data: Partial<User>): Promise<Result<UserDTO, Error>> {
    const [result, error] = await promisifier<UserDTO>(this.repo.create(data));
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async update(id: string, data: Partial<User>) {}
  async delete(id: string) {}

  async authenticate(
    pseudo: string,
    password: string
  ): Promise<Result<TUserWithToken, Error>> {
    const [user, error] = await this.findByPseudo(pseudo);
    if (error) {
      return err(new Error("no user found with this pseudo"));
    }
    const result = this.repo.compareHash(password, user.password);

    if (!result) {
      return err(new Error("incorrect password"));
    }

    const protectedUser = new UserDTO(user).protectPassword();

    return ok({
      user: protectedUser,
      token: this.generateToken(protectedUser),
    });
  }

  generateToken(user: UserDTO) {
    return jwt.sign(Object.assign({}, user), process.env.SECRET, {
      expiresIn: "10d",
    });
  }
}
