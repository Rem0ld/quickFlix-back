import { EntityManager } from "typeorm";
import { TUser } from "../../types";
import { User } from "./User.entity";
import bcrypt from 'bcryptjs'

class UserRepository {
  constructor(private manager: EntityManager) { }

  async findAll() {
    return this.manager.find(User);
  }

  async findByEmail(userEntity: TUser) {
    return this.manager.findOne(User, {
      where: {
        email: userEntity.email
      }
    });
  }

  async create(userEntity: TUser) {
    const salt = await bcrypt.genSalt(10)
    userEntity.password = bcrypt.hashSync(userEntity.password, salt)
    return this.manager.save(User, userEntity)
  }

  compareHash = async (password: string, hash: string) => await bcrypt.compareSync(password, hash)
}

export default UserRepository;
