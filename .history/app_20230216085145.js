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
