import { model, Schema } from "mongoose"
import { User } from "../types"

const schemaUser = new Schema<User>(
  {
    pseudo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["simple", "admin"],
      default: "simple",
    },
  },
  {
    timestamps: true,
  }
)

export const userModel = model<User>("user", schemaUser)

export default schemaUser
