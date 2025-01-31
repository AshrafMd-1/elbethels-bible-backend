const express = require("express");
const statusRoutes = require("./routes/statusRoutes");
const authRoutes = require("./routes/authRoutes");
const fetchRoutes = require("./routes/fetchRoutes");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

app.use("/", statusRoutes);
app.use("/", authRoutes);
app.use("/", fetchRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app };
