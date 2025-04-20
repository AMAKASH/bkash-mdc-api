const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/raw/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const uploadSingleFile = multer({
  storage: storage,
  limits: { fileSize: 1000000000 }, // Limit file size to 1000MB
});
