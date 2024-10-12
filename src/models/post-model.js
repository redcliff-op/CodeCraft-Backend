import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: True
  },
  content: {
    type: String
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  likedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  images: [
    {
      type: String
    }
  ],
}, {
  timestamps: true
})

export const Post = mongoose.model("Post", postSchema)