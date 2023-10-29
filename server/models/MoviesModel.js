import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    userName: { type: String, require: true },
    userImage: { type: String },
    rating: { type: Number, require: true },
    comment: { type: String, require: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const MoviesSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    titleImage: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      require: true,
    },
    year: {
      type: Number,
      require: true,
    },
    time: {
      type: Number,
      require: true,
    },
    video: {
      type: String,
      // require: true,
    },
    rate: {
      type: Number,
      require: true,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      require: true,
      default: 0,
    },
    reviews: [ReviewSchema],
    casts: [
      {
        id: { type: Number, require: true }, // Do generateId ở path CastsModal.js phía client
        name: { type: String, require: true },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Movies", MoviesSchema);
