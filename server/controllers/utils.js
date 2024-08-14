const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { Client, Storage, ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");
const { Readable } = require("stream");
const dotenv = require("dotenv");

const Image = require("../models/image_model");

dotenv.config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function uploadImage(fileBuffer, fileName) {
  console.log("FileName: ", fileName);
  const readableStream = new Readable();
  readableStream.push(fileBuffer);
  readableStream.push(null);
  try {
    if (!fileBuffer) throw new Error("Invalid file buffer");

    const response = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      InputFile.fromBuffer(readableStream, fileName)
    );

    return response.$id;
  } catch (err) {
    console.error("UPLOAD ERROR: ", err.message);
    throw new Error("Failed to upload image");
  }
}

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
    const imageId = req.params.id;
    console.log("imageId: ", imageId);

    if (!mongoose.Types.ObjectId.isValid(imageId))
      return res.status(400).json({ msg: "Invalid Image ID" });

    const image = await Image.findById(imageId);

    if (!image) return res.status(404).json({ msg: "Image not found" });

    const fileId = image.appwriteFileId;

    // GENERATE A URL
    const fileView = await storage.getFileView(
      process.env.APPWRITE_BUCKET_ID,
      fileId
    );
    res.redirect(fileView.href);
  } catch (err) {
    console.error("ERROR: ", err.message);
    res.status(500).json({ msg: "Failed to retrieve image" });
  }
});

module.exports = router;