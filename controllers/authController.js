const { saveToken, loadSavedToken } = require("../utils/googleAuth");
const {
  generateAuthenticationUrl,
  auth,
} = require("../services/googleApiAuthService");
const tokenStore = require("../store/tokenStore");

const authenticate = (req, res) => {
  try {
    const authUrl = generateAuthenticationUrl();
    if (!authUrl) throw new Error("Failed to generate auth URL");
    res.redirect(authUrl);
  } catch (error) {
    console.error("Authentication URL generation failed:", error);
    res.status(500).send("Authentication failed");
  }
};

const callback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code is missing");
  }

  try {
    const tokens = await auth.getToken(code);
    auth.setCredentials(tokens.tokens);
    await saveToken(tokens.tokens);

    if (tokenStore) {
      tokenStore.accessToken = tokens.tokens.access_token;
      tokenStore.expiresAt = tokens.tokens.expiry_date;
    } else {
      console.warn("Session is not initialized.");
    }

    res.redirect("/status");
  } catch (error) {
    console.error(
      "Error retrieving access token:",
      error.response?.data || error.message,
    );
    res.status(500).send("Authentication failed");
  }
};

const automaticAuth = async (req, res) => {
  try {
    const tokens = await loadSavedToken();
    if (tokens && tokenStore) {
      tokenStore.accessToken = tokens.access_token;
      tokenStore.expiresAt = tokens.expiry_date;
      auth.setCredentials(tokens);
    } else {
      console.log("No valid token found.");
    }
    const redirectUrl = tokenStore.originalUrl || "/status";
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(500).send("Authentication failed.");
  }
};

module.exports = { authenticate, callback, automaticAuth };
