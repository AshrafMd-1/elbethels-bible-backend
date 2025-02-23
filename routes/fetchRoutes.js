const router = require("express").Router();
const {fetchAudio} = require("../controllers/fetchController");

router.get("/fetch/:fileId", fetchAudio);

module.exports = router;
