const { google } = require("googleapis");
const fs = require("fs");
const { auth } = require("../services/googleApiAuthService");

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
    return auth.fromJSON(tokenData);
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
