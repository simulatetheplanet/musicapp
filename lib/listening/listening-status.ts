import type { ListeningStatus, Song } from "@/lib/product-types";

export function createArchivListeningStatus(song: Song): ListeningStatus {
  return {
    source: "archiv",
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
    return createArchivListeningStatus(appSong);
  }

  return lastFmRecentTrack;
}
