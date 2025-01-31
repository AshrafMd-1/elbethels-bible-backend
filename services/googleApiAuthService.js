const { google } = require("googleapis");
const credentials = require("../config/credentials.json");
const axios = require("axios");
const { loadSavedToken } = require("../utils/googleAuth");

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

async function refreshAccessToken(refresh_token) {
  try {
    const response = await axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      null,
      {
        params: {
          client_id: credentials.web.client_id,
          client_secret: credentials.web.client_secret,
          refresh_token: refresh_token,
          grant_type: "refresh_token",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response ? error.response.data : error.message,
    );
  }
}

module.exports = { auth, generateAuthenticationUrl, refreshAccessToken };
