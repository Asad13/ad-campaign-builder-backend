const multer = require("multer");

const storage = multer.memoryStorage();

// preapre the final multer upload object
const multerUploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 200000000, // 200MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "uploads") {
      if (file.mimetype === "video/mp4") {
        cb(null, true);
      } else {
        cb(new Error("Only .mp4 format allowed!"));
      }
    } else {
      cb(new Error("There was an unknown error!"));
    }
  },
});

module.exports = multerUploadVideo;
