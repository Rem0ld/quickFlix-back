import { model, Schema } from "mongoose"

const schemaUser = new Schema(
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

export const userModel = model("user", schemaUser)

export default schemaUser
