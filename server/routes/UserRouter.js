import express from "express";
import {
  addLikedMovie,
  changeUserPassword,
  deleteAllLikedMovies,
  deleteLikedMovie,
  deleteUser,
  deleteUserProfile,
  getLikedMovies,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/UserController.js";
import { admin, protect } from "../middlewares/Auth.js";

const router = express.Router();

// ******** PUBLIC ROUTES ******
router.post("/", registerUser);
router.post("/login", loginUser);

// ******** PRIVATE ROUTES ***********
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get("/favorites", protect, getLikedMovies);
router.post("/favorites", protect, addLikedMovie);
router.delete("/favorites/:id", protect, deleteLikedMovie);
router.delete("/favorites", protect, deleteAllLikedMovies);

// ******** ADMIN ROUTES ***********
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
