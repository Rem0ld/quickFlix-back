import { DeleteResult, EntityManager, UpdateResult } from "typeorm";
import { User } from "./User.entity";
import bcrypt from "bcryptjs";
import { BaseRepository } from "../../types";

class UserRepository implements BaseRepository<User> {
  constructor(private manager: EntityManager) { }

  async getCount(): Promise<number> {
    return this.manager.count(User);
  }

  async findAll() {
    return this.manager.find(User);
  }

  async findByPseudo(pseudo: string) {
    return this.manager.findOne(User, {
      where: {
        pseudo,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return this.manager.findOneBy(User, { id });
  }

  async create(userEntity: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    userEntity.password = bcrypt.hashSync(userEntity.password, salt);
    const user: User = await this.manager.save(User, userEntity);
    return user;
  }

  async createMany(data: Omit<User, "id">[]): Promise<User[]> {
    return [];
  }

  async delete(id: number): Promise<any> {
    return {};
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.manager.save(User, { id, ...data });
  }

  compareHash = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
  };
}

export default UserRepository;
