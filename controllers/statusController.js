const os = require("os");
const tokenStore = require("../store/tokenStore");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World!");
};

const status = (req, res) => {
  res.json({
    serverTime: {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    hyderabadTime: {
      date: new Date().toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      time: new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      timezone: "Asia/Kolkata",
    },
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
      serverUptime: `${Math.floor(os.uptime() / 60)} minutes`,
      applicationUptime: `${Math.floor((new Date() - tokenStore.startTime) / 60000)} minutes`,
    },
  });
};

module.exports = { helloWorld, status };
