import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import storage from "../config/firebaseStorage.js";
import { error } from "console";

const Uploadrouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

Uploadrouter.post("/", upload.single("file"), async (req, res) => {
  try {
    // Lấy file từ request
    const file = req.file;
    // Tạo mới filename
    if (file) {
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

      const blob = storage.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });
      // Nếu lỗi
      blobStream.on("error", (error) => {
        res.status(400).json({ message: error.message });
      });
      // Nếu thành công
      blobStream.on("finish", () => {
        // Lấy public URL
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
        // trả lại tên tệp và public URL của nó
        res.status(200).json(publicUrl);
      });
      blobStream.end(file.buffer);
      // Khi không có file
    } else {
      res.status(400).json({ message: "Please upload the file" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default Uploadrouter;
