const {google} = require("googleapis");
const {auth} = require("../services/googleApiAuthService");
const rangeParser = require("range-parser");

const fetchAudio = async (req, res) => {
	try {
		const {fileId} = req.params;

		if (!fileId) {
			return res.status(400).json({error: "Missing fileId parameter"});
		}

		const drive = google.drive({version: "v3", auth});

		const fileMetadata = await drive.files.get({
			fileId,
			fields: "size, mimeType",
		});

		const fileSize = parseInt(fileMetadata.data.size, 10);
		const mimeType = fileMetadata.data.mimeType || "audio/mpeg";

		res.setHeader("Content-Type", mimeType);
		res.setHeader("Accept-Ranges", "bytes");

		const range = req.headers.range;
		let start = 0;
		let end = fileSize - 1;

		if (range) {
			const parsedRanges = rangeParser(fileSize, range);
			if (parsedRanges !== -1 && parsedRanges !== -2) {
				const {start: parsedStart, end: parsedEnd} = parsedRanges[0];
				start = parsedStart;
				end = parsedEnd;
			}

			res.status(206);
			res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
		}

		res.setHeader("Content-Length", end - start + 1);

		const response = await drive.files.get(
		  {fileId, alt: "media"},
		  {responseType: "stream"}
		);

		response.data.pipe(res);
	} catch (error) {
		console.error("Error fetching audio:", error);
		res.status(500).json({error: "Failed to stream audio"});
	}
};

module.exports = {fetchAudio};
