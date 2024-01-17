import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: [true, "Username already exists"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: [false]
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"]
  },
  firse_name: { type: String },
  last_name: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String }
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
