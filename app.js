const express = require("express");
const statusRoutes = require("./routes/statusRoutes");
const authRoutes = require("./routes/authRoutes");
const fetchRoutes = require("./routes/fetchRoutes");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", statusRoutes);
app.use("/", authRoutes);
app.use("/", fetchRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app };
