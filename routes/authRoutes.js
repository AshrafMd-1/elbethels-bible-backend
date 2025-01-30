const { Router } = require("express");
const { authenticate, callback } = require("../controllers/authController");

const router = Router();

router.get("/auth", authenticate);
router.get("/Oauth2callback", callback);

module.exports = router;
