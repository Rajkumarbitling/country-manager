const { getCountries, postCountry, getCountryById } = require("../controller/country")
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = require("express").Router()

router.route("/countries").get(getCountries)

router.route("/country/:id").get(getCountryById)

// Multer setup for file uploads
const upload = multer({
    limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max file size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
}).single('image');

router.route("/country").post((req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, postCountry);

module.exports = router;