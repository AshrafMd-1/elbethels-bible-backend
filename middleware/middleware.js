const tokenStore = require("../store/tokenStore");

function isAuthenticated(req, res, next) {
  if (
    tokenStore &&
    tokenStore.accessToken &&
    tokenStore.expiresAt > Date.now()
  ) {
    next();
  } else {
    tokenStore.originalUrl = req.originalUrl;
    res.redirect("/autoAuth");
  }
}

module.exports = isAuthenticated;
