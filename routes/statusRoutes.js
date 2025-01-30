const express = require("express");
const { helloWorld, status } = require("../controllers/statusController");
const router = express.Router();

router.get("/", helloWorld);
router.get("/status", status);

module.exports = router;
