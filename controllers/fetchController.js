const { google } = require("googleapis");
const { auth } = require("../services/googleApiAuthService");

const fetchAudio = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ error: "Missing fileId parameter" });
    }

    const drive = google.drive({
      version: "v3",
      auth: auth,
    });

    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" },
    );

    res.setHeader("Content-Type", "audio/mpeg");
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching audio:", error);
    res.status(500).json({ error: "Failed to stream audio" });
  }
};

module.exports = { fetchAudio };
