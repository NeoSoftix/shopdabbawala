import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// uploads folder create
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, fileName);
  },
});

// file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

  const ext = path.extname(file.originalname).toLowerCase();

  const validMime = allowedTypes.includes(file.mimetype);

  const validExt = allowedExt.includes(ext);

  if (validMime && validExt) {
    return cb(null, true);
  }

  return cb(new Error("Only jpg, jpeg, png, webp files are allowed"), false);
};

// multer setup
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

// converts multer errors into JSON instead of Express's default HTML response
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image must be 1MB or smaller",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  }

  next();
};

// AUTO DELETE helper after cloudinary upload
export const removeLocalFile = (filePath) => {
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File delete error:", err.message);
      } 
    });
  }
};

export default upload;
