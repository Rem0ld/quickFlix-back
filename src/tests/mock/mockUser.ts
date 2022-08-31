import { TUser } from "../../types";

export const mockUser: Omit<TUser, "id"> = {
  pseudo: "pierrotLeFou",
  email: "p.lovergne@hotmail.fr",
  password: "Passw0rd",
  isAdmin: false,
};
