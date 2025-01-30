const os = require("os");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World!");
};

const status = (req, res) => {
  res.json({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    timezone: new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
    status: "Server is running",
    authenticated: !!req.session.accessToken,
    systemInfo: {
      platform: os.platform(),
      architecture: os.arch(),
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024))} MB`,
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024))} MB`,
    },
  });
};

module.exports = { helloWorld, status };
