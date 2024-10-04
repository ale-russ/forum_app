const multer = require("multer");
const { ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");
const { Readable } = require("stream");
const dotenv = require("dotenv");
const { storage } = require("../constants/appwrite");

dotenv.config();

const uploadFile = multer({ storage: multer.memoryStorage() });

async function uploadImage(fileBuffer, fileName) {
  console.log("FileName: ", fileName);

  try {
    if (!fileBuffer) throw new Error("Invalid file buffer");

    const response = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      InputFile.fromBuffer(fileBuffer, fileName)
    );

    return response.$id;
  } catch (err) {
    console.error("UPLOAD ERROR: ", err.message);
    throw new Error("Failed to upload image");
  }
}

module.exports = { uploadFile, uploadImage, storage };
