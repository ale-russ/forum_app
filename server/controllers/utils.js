const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { Client, Storage, ID } = require("node-appwrite");
const { Readable } = require("stream");
const dotenv = require("dotenv");
const InputFile = require("File");

const Image = require("../models/image_model");

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function uploadImage(fileBuffer, fileName) {
  console.log("FileName: ", fileName);
  try {
    if (!fileBuffer) throw new Error("Invalid file buffer");

    const response = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      fileName
    );

    return response.$id;
  } catch (err) {
    console.error("UPLOAD ERROR: ", err.message);
    throw new Error("Failed to upload image");
  }
}

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file found" });

    const fileId = await uploadImage(req.file.buffer, req.file.originalname);

    if (!fileId) return res.status(500).json({ msg: "Failed to upload image" });

    const image = new Image({
      fileName: req.file.originalname,
      appwriteFileId: fileId,
    });

    await image.save();
    res.json({ msg: "Image uploaded successfully", fileId });
  } catch (err) {
    console.error("ROUTE ERROR: ", err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/image/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ msg: "Image not found" });

    const fileId = image.appwriteFileId;
    const fileView = await storage.getFileView("66bb787c001fba52767d", fileId);
    res.redirect(fileView.href); // Redirect to the Appwrite file view URL
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Failed to retrieve image" });
  }
});

module.exports = router;
