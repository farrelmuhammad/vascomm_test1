const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const dotenv = require("dotenv");
const { Op } = require("sequelize");

const db = require("./config/db");
const User = require("./models/user");

dotenv.config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/register", upload.single("selfie"), async (req, res) => {
  const { name, email, password } = req.body;
  const selfie = req.file.filename;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      selfie,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
  }
});
