import UserService from "../User/User.service";


export default class AuthenticationService {
  constructor(private service: UserService) { }

  authenticate(pseudo: string, password: string) {
    if (!pseudo.length || !password.length) {
      throw new Error("missing input")
    }
    try {
      const user = this.service.authenticate(pseudo, password)
      return user;
    } catch (error) {
      throw new Error(error)
    }
  }

  // Should check if token is still valid
  verifyToken() {

  }

  // Should return the token decoded
  parseToken() {

  }
}