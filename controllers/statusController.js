const os = require("os");
const tokenStore = require("../store/tokenStore");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World!");
};

const status = (req, res) => {
  res.json({
    date: new Date().toLocaleDateString("en-IN"),
    time: new Date().toLocaleTimeString("en-IN"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    status: "Server is running",
    authenticated: !!tokenStore.accessToken,
    tokenExpireTime: tokenStore.expiresAt
      ? new Date(tokenStore.expiresAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      : null,
    systemInfo: {
      platform: os.platform(),
      architecture: os.arch(),
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024))} MB`,
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024))} MB`,
      cpuCount: os.cpus().length,
      uptime: `${Math.floor(os.uptime() / 60)} minutes`,
    },
  });
};

module.exports = { helloWorld, status };
