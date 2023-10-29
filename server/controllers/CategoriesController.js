import asyncHandler from "express-async-handler";
import Categories from "../models/CategoriesModel.js";

// ******** PUBLIC CONTROLLERS ***********
// @desc get all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    // Tìm tất cả thể loại trong database
    const categories = await Categories.find({});
    // Gửi tất cả thể loại lên client
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** ADMIN CONTROLLERS ***********
// @desc create new category
// @route POST /api/categories
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    // Lấy title từ request body
    const { title } = req.body;
    // Kiểm tra đã có thể loại này chưa
    const categoryExist = await Categories.find({ title: title });
    //categoryExist.title.includes(title)
    if (categoryExist.length > 0) {
      res.status(400);
      throw new Error("Đã có sẵn thể loại này");
    }
    // Tạo mới thể loại
    const category = await Categories({ title });
    // Lưu thể loại vào db
    const createdCategory = await category.save();
    // Gửi tất cả thể loại lên client
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc update category
// @route PUT /api/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  try {
    // Lấy thể loại từ requeset params
    const category = await Categories.findById(req.params.id);
    if (category) {
      //Cập nhật thể loại
      category.title = req.body.title || category.title;
      // Lưu thể loại đã được cập nhật vào db
      const updatedCategory = await category.save();
      // Gửi thể loại đcược cập nhật lên client
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Không tìm thấy thể loại" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc delete category
// @route DELETE /api/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    // Lấy thể loại từ requeset params
    const category = await Categories.findById(req.params.id);
    if (category) {
      // Xoá thể loại trong db
      await category.deleteOne();
      // Gửi thông báo lên client
      res.json({ message: "Thể loại đã được xóa" });
    } else {
      res.status(404).json({ message: "Không tìm thấy thể loại" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { getCategories, createCategory, updateCategory, deleteCategory };
