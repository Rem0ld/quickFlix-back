import UserService from "../User/User.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Timestamp } from "typeorm";
import { User } from "../User/User.entity";
import { UserDTO } from "../User/User.dto";
import { err, ok, MissingDataPayloadException } from "../../services/Error";
import { Result } from "../../types";
import { promisifier } from "../../services/promisifier";

export default class AuthenticationService {
  private fiveDays: number;
  constructor(private service: UserService) {
    this.fiveDays = 1000 * 3600 * 24 * 5;
  }

  async authenticate(pseudo: string, password: string) {
    if (!pseudo.length || !password.length) {
      return err(new MissingDataPayloadException("pseudo or password"));
    }

    const [result, error] = await this.service.authenticate(pseudo, password);
    if (error) {
      return err(error);
    }

    return ok(result);
  }

  decodeToken(token: string) {
    return jwt.verify(token, process.env.SECRET);
  }

  // Should check if token is still valid
  verifyToken(token: string): Result<boolean, Error> {
    const decoded: any = this.decodeToken(token);

    if (!decoded) {
      return err(new Error("cannot verify token"));
    }

    const now = new Date().getTime();
    return ok(decoded.exp > now / 1000);
  }

  // Should return the token decoded
  parseToken(token: string) {
    const [isValid, error] = this.verifyToken(token);
    if (error) {
      return err(error);
    }

    if (!isValid) {
      return err(new Error("Invalid or expired token"));
    }

    const decoded = this.decodeToken(token);
    return decoded;
  }

  async generateNewToken(token: string) {
    if (!token.length) {
      return err(new Error("token string should have length"));
    }

    const decoded: any = this.parseToken(token);
    const { pseudo } = decoded;
    const [userDto, error] = await promisifier<UserDTO>(
      this.service.findByPseudo(pseudo)
    );
    if (error) {
      return err(new Error("something wrong happen"));
    }
    const newToken = this.service.generateToken(userDto.protectPassword());

    return ok(newToken);
  }
}
