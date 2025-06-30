import multer from "multer";
import path from "path";
import fs from "fs";
import { HttpError } from "../classes/http-error.js";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".txt") {
      return cb(
        new HttpError("Only .txt files are allowed", 415, "BAD_REQUEST", {
          file: file.originalname,
        })
      );
    }
    cb(null, true);
  },
});
