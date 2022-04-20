const multer = require("multer");
const path = require("path");

const IMAGEFOLDER = path.join(__dirname, "../images");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, IMAGEFOLDER);
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, "sauce_" + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
