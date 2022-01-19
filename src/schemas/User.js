import { model, Schema } from "mongoose"

const schemaUser = new Schema(
  {
    pseudo: String,
    email: String,
  },
  {
    timestamps: true,
  }
)

export const userModel = model("user", schemaUser)

export default schemaUser
