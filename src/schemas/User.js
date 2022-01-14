import { Schema } from "mongoose";

const User = new Schema({
  pseudo: String,
  email: String
})

export default User;