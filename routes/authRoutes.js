const { Router } = require("express");
const {
  authenticate,
  callback,
  automaticAuth,
} = require("../controllers/authController");

const router = Router();

router.get("/auth", authenticate);
router.get("/Oauth2callback", callback);
router.get("/autoAuth", automaticAuth);

module.exports = router;
