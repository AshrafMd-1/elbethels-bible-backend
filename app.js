const express = require("express");
const statusRoutes = require("./routes/statusRoutes");
const fetchRoutes = require("./routes/fetchRoutes");
const tokenStore = require("./store/tokenStore");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", statusRoutes);
app.use("/", fetchRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	tokenStore.startTime = new Date();
});

module.exports = {app};
