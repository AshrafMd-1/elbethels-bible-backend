const { google } = require("googleapis");
const credentials = require("../config/credentials.json");

const auth = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0],
);

function generateAuthenticationUrl() {
  return auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
    prompt: "consent",
  });
}

module.exports = { auth, generateAuthenticationUrl };
