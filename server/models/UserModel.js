import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Làm ơn nhập họ tên"],
    },
    email: {
      type: String,
      required: [true, "Làm ơn nhập email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Làm ơn nhập mật khẩu"],
      minlength: [8, "Mật khẩu chứ ít nhất 8 ký tự"],
      validate: {
        validator: function (value) {
          // Regular expression to check for at least one number and one character
          return /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(value);
        },
        message: "Mật khẩu phải chứa cả kí tự lẫn số",
      },
    },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likedMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
