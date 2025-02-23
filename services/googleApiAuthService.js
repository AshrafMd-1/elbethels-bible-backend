const {google} = require("googleapis");

const auth = new google.auth.GoogleAuth({
	keyFile: "config/service-account.json",
	scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

module.exports = {auth};