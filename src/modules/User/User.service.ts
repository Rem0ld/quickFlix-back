import { User } from "./User.entity";
import UserRepository from "./User.repository";
import jwt from "jsonwebtoken";

export default class UserService {
  repo: UserRepository;
  constructor(repo: UserRepository) { }

  async findByPseudo(pseudo: string): Promise<User | null> {
    if (!pseudo.length) {
      throw new Error("missing pseudo");
    }

    try {
      const user = await this.repo.findByPseudo(pseudo);

      if (!user) {
        throw new Error("no user found");
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
  async create(data: Partial<User>) { }
  async update(id: string, data: Partial<User>) { }
  async delete(id: string) { }

  async authenticate(pseudo: string, password: string) {
    try {
      const user: User = await this.findByPseudo(pseudo);
      if (!user) {
        throw new Error("no user found ");
      }
      const result = this.repo.compareHash(password, user.password);

      if (!result) {
        throw new Error("incorrect password");
      }

      return {
        user,
        token: this.generateToken(user),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  generateToken(user: User) {
    return jwt.sign(user, process.env.SECRET);
  }
}
