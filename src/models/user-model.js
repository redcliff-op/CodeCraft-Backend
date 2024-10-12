import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    default: "user"
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null
  },
  dob: {
    type: Date,
    default: null
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post"
    }
  ],
  profilePicture: {
    type: String
  }
},{
  timestamps: true
})

export const User = mongoose.model("User", userSchema);