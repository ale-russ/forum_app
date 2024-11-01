const multer = require("multer");
const { ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");
const { Readable } = require("stream");
const dotenv = require("dotenv");
const { storage } = require("../constants/appwrite");

const User = require("../models/user_models");

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

const processMentions = async (content) => {
  const mentionPattern = /@(\w+)/g;
  const mentionedUserNames = content.math(mentionPattern);

  if (!mentionedUserNames) return [];

  const mentionedUsers = await User.find({
    userName: { $in: mentionedUserNames.map((name) => name.slice(1)) },
  });

  return mentionedUsers;
};

module.exports = { uploadFile, uploadImage, storage, processMentions };
