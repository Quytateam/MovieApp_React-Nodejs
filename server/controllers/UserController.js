import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/Auth.js";

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;
  try {
    const userExists = await User.findOne({ email });
    // check if user exists
    if (userExists) {
      res.status(400);
      throw new Error("Tài khoản đã tồn tại");
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      image,
    });

    // if user created successfully send user data and token to client
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Dữ liệu người dùng không hợp lệ"); //Invalid user data
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm tài khoản trong DB
    const user = await User.findOne({ email });
    // If user exists compare password with hashed password  then send user data and token to client
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
      // Nếu tài khaorn không tìm thấy
    } else {
      res.status(401);
      throw new Error("Email hoặc mật khẩu không hợp lệ");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** PRIVATE CONTROLLERS ***********

// @desc Update user profile
// @route PUT /api/user/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    // Tìm tk trong DB
    const user = await User.findById(req.user._id);
    // Nếu tài khoản tồn tại
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updateUser = await user.save();

      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
      // else send error message
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete user profile
// @route Delete /api/user/profile
// @access Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    // Tìm tài khoản
    const user = await User.findById(req.user._id);
    // Nếu tồn tại
    if (user) {
      // Nếu tài khoản là Admin
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Tài khoản Admin không thể xóa");
      }
      // else => xóa
      await user.deleteOne();
      res.json({ message: "Tài khoản đã xóa" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Change user password
// @route PUT /api/user/password
// @access Private
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    // Tìm tà khoản
    const user = await User.findById(req.user._id);
    // Nếu tồn tại
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Mật khẩu đã được thay đổi!" });
    } else {
      res.status(401);
      throw new Error("Mật khẩu cũ không đúng");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Get all liked movie
// @route GET /api/user/favorites
// @access Private
const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    //Tìm tk
    const user = await User.findById(req.user._id).populate("likedMovies");
    // Nếu tk tồn tại
    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Add movie to liked movie
// @route POST /api/users/favorites
// @access Private
const addLikedMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  try {
    //Tìm tk
    const user = await User.findById(req.user._id);
    // Nếu tk tồn tại
    if (user) {
      // Kiểm tra xem phim này đã thích chưa
      //   const isMovieLiked = user.likedMovies.find(
      //     (movie) => movie.toString() === movieId
      //   );
      //Nếu phim đã thích
      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Phim đã được thích");
      }
      //Nếu chưa thích
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete liked movie
// @route DELETE /api/users/favorites/:id
// @access Private
const deleteLikedMovie = asyncHandler(async (req, res) => {
  try {
    //Tìm tk
    const user = await User.findById(req.user._id);
    // Nếu tk tồn tại
    if (user) {
      await user.updateOne({
        $pull: { likedMovies: req.params.id.toString() },
      });
      await user.save();
      res.json({ message: "Phim yêu thích đã được xóa" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete all liked movie
// @route DELETE /api/users/favorites
// @access Private
const deleteAllLikedMovies = asyncHandler(async (req, res) => {
  try {
    //Tìm tk
    const user = await User.findById(req.user._id);
    // Nếu tk tồn tại
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "Đã xóa hết những bộ phim yêu thích của bạn" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** ADMIN CONTROLLERS ***********
// @desc Get all user
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    // Tìm all tk in DB
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  try {
    //Tìm tk
    const user = await User.findById(req.params.id);
    // Nếu tk tồn tại
    if (user) {
      // Nếu tài khoản là Admin
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Tài khoản Admin không thể xóa");
      }
      // else => xóa
      await user.deleteOne();
      res.json({ message: "Tài khoản đã xóa" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getLikedMovies,
  addLikedMovie,
  deleteLikedMovie,
  deleteAllLikedMovies,
  getUsers,
  deleteUser,
};
