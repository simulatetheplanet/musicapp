import type { ListeningStatus, Song } from "@/lib/product-types";

export function createMusicAppListeningStatus(song: Song): ListeningStatus {
  return {
    source: "musicapp",
    title: song.title,
    artist: song.artist,
    isNowPlaying: true,
    listenedAtLabel: "Now",
  };
}

export function chooseProfileListeningStatus({
  appSong,
  lastFmRecentTrack,
}: {
  appSong?: Song;
  lastFmRecentTrack?: ListeningStatus;
}) {
  if (appSong) {
    return createMusicAppListeningStatus(appSong);
  }

  return lastFmRecentTrack;
}
