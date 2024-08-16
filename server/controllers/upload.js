const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Image = require("../models/image_model");
const { verifyToken } = require("../middleware/auth");
const { uploadFile, uploadImage, storage } = require("../middleware/utils");

dotenv.config();
const router = express.Router();

const baseUrl = process.env.APPWRITE_ENDPOINT;
const bucketId = process.env.APPWRITE_BUCKET_ID;
const projectId = process.env.APPWRITE_PROJECT_ID;

router.post("/upload-image", uploadFile.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file found" });

    console.log("req.file", req.file);

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
router.get("/image-url/:id", verifyToken, async (req, res) => {
  console.log("in get image");
  try {
    const imageId = req.params.id;
    console.log("imageId: ", imageId);

    if (!mongoose.Types.ObjectId.isValid(imageId))
      return res.status(400).json({ msg: "Invalid Image ID" });

    const image = await Image.findById(imageId);

    console.log("Image: ", image);

    if (!image) return res.status(404).json({ msg: "Image not found" });

    console.log("Image from appwrite: ", image);

    const fileId = image.appwriteFileId;

    console.log("fileId ", fileId);

    // GENERATE A URL
    const fileView = await storage.getFilePreview(
      process.env.APPWRITE_BUCKET_ID,
      fileId
    );

    const url = `${baseUrl}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

    console.log(url);

    res.send(url);
    // return url.href;
  } catch (err) {
    console.error("ERROR: ", err.message);
    res.status(500).json({ msg: "Failed to retrieve image" });
  }
});

module.exports = router;
