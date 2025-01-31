function isAuthenticated(req, res, next) {
  if (req.session.accessToken && req.session.expiresIn > Date.now()) {
    next();
  } else {
    req.session.originalUrl = req.originalUrl;
    res.redirect("/autoAuth");
  }
}

module.exports = isAuthenticated;
