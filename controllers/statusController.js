const os = require("os");
const diskusage = require("diskusage");
const tokenStore = require("../store/tokenStore");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World!");
};

const status = async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const usedMemory = Math.round(memoryUsage.rss / (1024 * 1024));
  const heapTotal = Math.round(memoryUsage.heapTotal / (1024 * 1024));
  const heapUsed = Math.round(memoryUsage.heapUsed / (1024 * 1024));

  let diskStats = {};
  try {
    diskStats = diskusage.checkSync("/");
  } catch (err) {
    diskStats = { total: 0 };
  }

  const loadAverages = os.loadavg();

  res.json({
    serverTime: {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    adminTime: {
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
      : "Not Authorized",
    systemInfo: {
      platform: os.platform(),
      architecture: os.arch(),
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024))} MB`,
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024))} MB`,
      cpuCount: os.cpus().length,
      serverUptime: `${Math.floor(os.uptime() / 60)} minutes`,
      applicationUptime: `${Math.floor((new Date() - tokenStore.startTime) / 60000)} minutes`,
      processMemoryUsage: {
        usedMemory: `${usedMemory} MB`,
        heapTotal: `${heapTotal} MB`,
        heapUsed: `${heapUsed} MB`,
      },
      disk: {
        totalSpace: `${Math.round(diskStats.total / (1024 * 1024 * 1024))} GB`,
      },
      loadAverages: {
        "1min": loadAverages[0],
        "5min": loadAverages[1],
        "15min": loadAverages[2],
      },
    },
  });
};

module.exports = { status };

module.exports = { helloWorld, status };
