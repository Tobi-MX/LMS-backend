import mongoose from "mongoose";

const replySchema = new mongoose.Schema({

  discussion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discussion",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true
  }

}, { timestamps: true });

export const Reply = mongoose.model("Reply", replySchema);