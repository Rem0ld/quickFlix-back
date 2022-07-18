import UserService from "../User/User.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Timestamp } from "typeorm";
import { User } from "../User/User.entity";
import { UserDTO } from "../User/User.dto";

export default class AuthenticationService {
  private fiveDays: number;
  constructor(private service: UserService) {
    this.fiveDays = 1000 * 3600 * 24 * 5;
  }

  authenticate(pseudo: string, password: string) {
    if (!pseudo.length || !password.length) {
      throw new Error("missing password or pseudo");
    }
    try {
      const user = this.service.authenticate(pseudo, password);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  decodeToken(token: string) {
    if (!token.length) {
      throw new Error("missing parameter");
    }
    return jwt.verify(token, process.env.SECRET);
  }

  // Should check if token is still valid
  verifyToken(token: string) {
    try {
      const decoded: any = this.decodeToken(token);
      const now = new Date().getTime();
      return decoded?.exp > now / 1000;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Should return the token decoded
  parseToken(token: string) {
    const isValid = this.verifyToken(token);

    if (!isValid) {
      throw new Error("Invalid or expired token");
    }

    const decoded = this.decodeToken(token);
    return decoded;
  }

  async generateNewToken(token: string) {
    if (!token.length) {
      throw new Error("token string should have length");
    }

    try {
      const decoded: any = this.parseToken(token);
      const { pseudo } = decoded;
      const user = new UserDTO(
        await this.service.findByPseudo(pseudo)
      ).protectPassword();
      const newToken = this.service.generateToken(user);

      return newToken;
    } catch (error) {
      throw new Error(error);
    }
  }
}
