const { google } = require("googleapis");
const fs = require("fs");
const {
  auth,
  refreshAccessToken,
} = require("../services/googleApiAuthService");

const tokenPath = "./config/token.json";

const saveToken = async (token) => {
  const payload = JSON.stringify(token);
  try {
    await fs.promises.writeFile(tokenPath, payload);
    console.log("Token saved successfully.");
  } catch (error) {
    console.error("Error saving token", error);
  }
};

const loadSavedToken = async () => {
  try {
    await fs.promises.access(tokenPath, fs.constants.F_OK);
    const tokenFile = await fs.promises.readFile(tokenPath);
    const tokenData = JSON.parse(tokenFile);

    if (tokenData.expiry_date && tokenData.expiry_date < Date.now()) {
      console.log("Token expired, refreshing...");

      try {
        const newTokenData = await refreshAccessToken(tokenData.refresh_token);
        const tokenPayload = {
          access_token: newTokenData.access_token,
          refresh_token: tokenData.refresh_token || newTokenData.refresh_token,
          expiry_date: new Date() + newTokenData.expires_in,
          token_type: newTokenData.token_type,
          scope: newTokenData.scope,
        };

        await saveToken(tokenPayload);
        auth.setCredentials(tokenPayload);
        return tokenPayload;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw refreshError;
      }
    } else {
      auth.setCredentials(tokenData);
      return tokenData;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Token file not found, creating a new one.");

      const emptyToken = {
        access_token: null,
        refresh_token: null,
        expiry_date: null,
      };

      await saveToken(emptyToken);
      return null;
    } else {
      console.error("Error loading token", error);
      throw error;
    }
  }
};

module.exports = { saveToken, loadSavedToken };
