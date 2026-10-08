const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();


// ======================================================
// Multer Storage Configuration
// ======================================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


// ======================================================
// File Type Filter
// ======================================================

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/x-msvideo",
        "video/webm"
    ];

    const allowedExtensions = [
        ".mp4",
        ".avi",
        ".mov",
        ".webm"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(extension)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed!"), false);
    }
};


// ======================================================
// Multer Upload
// ======================================================

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});


// ======================================================
// POST - Upload Traffic Video
// ======================================================

router.post("/upload", upload.single("video"), (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No video file uploaded"
            });
        }

        res.status(201).json({
            message: "Video uploaded successfully!",
            data: {
                original_name: req.file.originalname,
                saved_name: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                type: req.file.mimetype
            }
        });

    } catch (error) {

        console.error(
            "Video upload error:",
            error.message
        );

        res.status(500).json({
            message: "Video upload failed",
            error: error.message
        });
    }
});


module.exports = router;