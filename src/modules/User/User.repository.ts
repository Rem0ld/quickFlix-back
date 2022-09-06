import { DeleteResult, EntityManager, UpdateResult } from "typeorm";
import { User } from "./User.entity";
import bcrypt from "bcryptjs";
import { BaseRepository, TResultService } from "../../types";
import { UserDTO } from "./User.dto";

class UserRepository implements BaseRepository<UserDTO> {
  constructor(private manager: EntityManager) {}

  async getCount(): Promise<number> {
    return this.manager.count(User);
  }

  async findAll(limit: number, skip: number): Promise<TResultService<UserDTO>> {
    const result = await this.manager
      .getRepository(User)
      .createQueryBuilder("user")
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return { data: result[0].map(el => new UserDTO(el)), total: result[1] };
  }

  async findByPseudo(pseudo: string) {
    const result = await this.manager.findOne(User, {
      where: {
        pseudo,
      },
    });

    return new UserDTO(result);
  }

  async findById(id: number): Promise<UserDTO> {
    const result = await this.manager.findOneBy(User, { id });

    return new UserDTO(result);
  }

  async create(userEntity: Partial<User>): Promise<UserDTO> {
    const salt = await bcrypt.genSalt(10);
    userEntity.password = bcrypt.hashSync(userEntity.password, salt);
    const user: User = await this.manager.save(User, userEntity);
    return new UserDTO(user);
  }

  // Not implemented
  async createMany(data: Omit<User, "id">[]): Promise<UserDTO[]> {
    return [];
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(User, "user")
      .delete()
      .where("id= :id", { id })
      .execute();
  }

  async update(id: number, data: Partial<User>): Promise<UserDTO> {
    const result = await this.manager.save(User, { id, ...data });
    return new UserDTO(result);
  }

  compareHash = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
  };
}

export default UserRepository;
