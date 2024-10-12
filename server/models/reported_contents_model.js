const mongoose = require("mongoose");

const reportedContentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  reason: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReportedContents", reportedContentSchema);
