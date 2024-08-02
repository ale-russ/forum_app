const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./controllers/userController");
const forumRoute = require("./controllers/forumController");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.log("MONGODB CONNECTION ERROR: ", err));

// auth routes
app.use("/auth", authRoutes);
app.use("/forum", forumRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API!" });
});

const HOST = process.env.HOST || "localhost";

app.listen(PORT, (HOST) => {
  console.log(`Server listening on ${PORT}`);
});
