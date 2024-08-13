const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: String,
  appwriteFileId: String,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
