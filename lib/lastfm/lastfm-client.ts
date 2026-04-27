import { createHash } from "node:crypto";

const lastFmApiUrl = "https://ws.audioscrobbler.com/2.0/";
const lastFmAuthUrl = "https://www.last.fm/api/auth/";

export type LastFmRecentTrack = {
  title: string;
  artist: string;
  isNowPlaying: boolean;
  listenedAtLabel: string;
};

export type LastFmTrackInput = {
  artist: string;
  track: string;
  album?: string;
  durationSeconds?: number;
};

function getLastFmConfig() {
  return {
    apiKey: process.env.LASTFM_API_KEY,
    sharedSecret: process.env.LASTFM_SHARED_SECRET,
  };
}

function assertLastFmConfig() {
  const { apiKey, sharedSecret } = getLastFmConfig();

  if (!apiKey || !sharedSecret) {
    throw new Error("Last.fm API key and shared secret are required.");
  }

  return { apiKey, sharedSecret };
}

export function createLastFmApiSignature(
  params: Record<string, string | number | undefined>,
  sharedSecret: string,
) {
  const signatureBase = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}${value}`)
    .join("");

  return createHash("md5")
    .update(`${signatureBase}${sharedSecret}`, "utf8")
    .digest("hex");
}

export function createLastFmAuthUrl(token: string) {
  const { apiKey } = getLastFmConfig();
  const url = new URL(lastFmAuthUrl);

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  url.searchParams.set("token", token);

  return url.toString();
}

export function shouldScrobble({
  durationSeconds,
  secondsPlayed,
}: {
  durationSeconds: number;
  secondsPlayed: number;
}) {
  if (durationSeconds < 30) {
    return false;
  }

  const requiredSeconds = Math.min(durationSeconds / 2, 240);

  return secondsPlayed >= requiredSeconds;
}

export async function getLastFmRecentTrack(username: string) {
  const { apiKey } = assertLastFmConfig();
  const url = new URL(lastFmApiUrl);

  url.searchParams.set("method", "user.getRecentTracks");
  url.searchParams.set("user", username);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Last.fm recent track lookup failed.");
  }

  const payload = (await response.json()) as {
    recenttracks?: {
      track?: Array<{
        name?: string;
        artist?: { "#text"?: string };
        "@attr"?: { nowplaying?: string };
        date?: { "#text"?: string };
      }>;
    };
  };

  const track = payload.recenttracks?.track?.[0];

  if (!track?.name || !track.artist?.["#text"]) {
    return null;
  }

  const isNowPlaying = track["@attr"]?.nowplaying === "true";

  return {
    title: track.name,
    artist: track.artist["#text"],
    isNowPlaying,
    listenedAtLabel: isNowPlaying ? "Now" : track.date?.["#text"] ?? "Most recent",
  } satisfies LastFmRecentTrack;
}

async function postSignedLastFmRequest(params: Record<string, string | number | undefined>) {
  const { apiKey, sharedSecret } = assertLastFmConfig();
  const signedParams = {
    ...params,
    api_key: apiKey,
  };
  const body = new URLSearchParams();

  Object.entries({
    ...signedParams,
    api_sig: createLastFmApiSignature(signedParams, sharedSecret),
    format: "json",
  }).forEach(([key, value]) => {
    if (value !== undefined) {
      body.set(key, String(value));
    }
  });

  const response = await fetch(lastFmApiUrl, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("Last.fm write request failed.");
  }

  return response.json();
}

export async function updateLastFmNowPlaying({
  sessionKey,
  track,
}: {
  sessionKey: string;
  track: LastFmTrackInput;
}) {
  return postSignedLastFmRequest({
    method: "track.updateNowPlaying",
    artist: track.artist,
    track: track.track,
    album: track.album,
    duration: track.durationSeconds,
    sk: sessionKey,
  });
}

export async function scrobbleLastFmTrack({
  sessionKey,
  track,
  timestamp,
}: {
  sessionKey: string;
  track: LastFmTrackInput;
  timestamp: number;
}) {
  return postSignedLastFmRequest({
    method: "track.scrobble",
    artist: track.artist,
    track: track.track,
    album: track.album,
    duration: track.durationSeconds,
    timestamp,
    sk: sessionKey,
  });
}
