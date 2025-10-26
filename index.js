const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
require("dotenv").config();

const app = express();
const port = process.env.port || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.static(__dirname));

async function fetchLastfmData(method, user, extraParams = {}) {
  if (!API_KEY) throw new Error("Missing API Key");
  const params = new URLSearchParams({
    method,
    user,
    api_key: API_KEY,
    format: "xml",
    ...extraParams,
  });
  const url = `https://ws.audioscrobbler.com/2.0/?${params.toString()}`;
  const response = await axios.get(url);
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(response.data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function buildBadge({ provider, label, message, color, style, icon }) {
  switch (provider.toLowerCase()) {
    case "badgen":
      return `https://badgen.net/static/${encodeURIComponent(label)}/${encodeURIComponent(
        message
      )}/${color}`;
    case "badgers":
      return `https://badgers.space/badge/${encodeURIComponent(label)}/${encodeURIComponent(
        message
      )}/${color}`;
    case "shields":
    default:
      return `https://img.shields.io/static/v1?label=${encodeURIComponent(
        label
      )}&color=${color}&style=${style}&message=${encodeURIComponent(
        message
      )}&logo=${icon}`;
  }
}

function getQueryParams(req) {
  const {
    user = process.env.USER || "rj",
    provider = "shields",
    style = "flat",
    color = "red",
    label,
    icon = "lastdotfm",
    format,
    rank = 1,
    sort = "ALL",
  } = req.query;
  return {
    user,
    provider,
    style,
    color,
    label,
    icon,
    format,
    rank: parseInt(rank, 10),
    sort: sort.toString().toUpperCase(),
  };
}

function sendResponse(res, { provider, label, color, style, icon, message, format }) {
  if (format === "json") {
    return res.json({ message });
  }

  if (format === "txt" || format === "text") {
    return res.type("text/plain").send(message);
  }

  const badgeUrl = buildBadge({ provider, label, message, color, style, icon });
  res.redirect(badgeUrl);
}

function mapSortToPeriod(sort) {
  const map = {
    "7": "7day",
    "30": "1month",
    "90": "3month",
    "180": "6month",
    "365": "12month",
    "ALL": "overall",
  };
  return map[sort] || "overall";
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/last-played", async (req, res) => {
  try {
    const { user, provider, style, color, label, icon, format } = getQueryParams(req);
    const data = await fetchLastfmData("user.getrecenttracks", user, { limit: 1 });
    const track = data?.lfm?.recenttracks?.[0]?.track?.[0];
    if (!track) throw new Error("Missing track data");
    const artist = track.artist[0]._ || track.artist[0];
    const song = track.name[0];
    sendResponse(res, {
      provider,
      label: label || "Last Played",
      color,
      style,
      icon,
      message: `${song} by ${artist}`,
      format,
    });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

async function handleTopRequest(req, res, { type }) {
  try {
    const { user, provider, style, color, label, icon, format, rank, sort } = getQueryParams(req);
    const period = mapSortToPeriod(sort);
    const method = `user.gettop${type}`;
    const data = await fetchLastfmData(method, user, { limit: rank, period });
    let list, item, message;

    switch (type) {
      case "artists":
        list = data?.lfm?.topartists?.[0]?.artist;
        item = list?.[rank - 1];
        message = item?.name?.[0];
        break;
      case "tracks":
        list = data?.lfm?.toptracks?.[0]?.track;
        item = list?.[rank - 1];
        message = item ? `${item.name[0]} by ${item.artist[0].name[0]}` : undefined;
        break;
      case "albums":
        list = data?.lfm?.topalbums?.[0]?.album;
        item = list?.[rank - 1];
        message = item ? `${item.name[0]} by ${item.artist[0].name[0]}` : undefined;
        break;
      case "tags":
        list = data?.lfm?.toptags?.[0]?.tag;
        item = list?.[rank - 1];
        message = item?.name?.[0];
        break;
      default:
        throw new Error("Unsupported type");
    }

    if (!message) throw new Error("Missing data");
    const prettyLabelMap = {
      artists: "Top Artist",
      tracks: "Top Track",
      albums: "Top Album",
      tags: "Top Tag",
    };
    const labelText = label || `${prettyLabelMap[type]} (${sort === "ALL" ? "All Time" : `Last ${sort} Days`})`;

    sendResponse(res, {
      provider,
      label: labelText,
      color,
      style,
      icon,
      message,
      format,
    });
  } catch (error) {
    res.status(500).send(`Error fetching ${type} data`);
  }
}

app.get("/top-artist", (req, res) => handleTopRequest(req, res, { type: "artists" }));
app.get("/top-track", (req, res) => handleTopRequest(req, res, { type: "tracks" }));
app.get("/top-album", (req, res) => handleTopRequest(req, res, { type: "albums" }));
app.get("/top-tag", (req, res) => handleTopRequest(req, res, { type: "tags" }));

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;