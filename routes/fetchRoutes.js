const router = require("express").Router();
const { fetchAudio } = require("../controllers/fetchController");
const isAuthenticated = require("../middleware/middleware");

router.get("/fetch/:fileId", isAuthenticated, fetchAudio);

module.exports = router;
