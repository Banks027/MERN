const fs = require("fs");
const path = require("path");
const multer = require("multer");

const listingsUploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "listings"
);

/*
 * Make sure the upload directory exists when the server starts.
 *
 * recursive: true means Node will also create the parent
 * uploads folder if it does not already exist.
 */
fs.mkdirSync(listingsUploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, listingsUploadDirectory);
  },

  filename(req, file, callback) {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      `listing-${Date.now()}-` +
      `${Math.round(Math.random() * 1e9)}` +
      extension;

    callback(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function fileFilter(req, file, callback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error(
      "Only JPEG, PNG, and WebP images are allowed."
    );

    error.code = "INVALID_IMAGE_TYPE";

    return callback(error);
  }

  callback(null, true);
}

const uploadListingImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadListingImages;