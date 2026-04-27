import type { Song } from "@/lib/product-types";

export function searchAccessibleSongs({
  songs,
  query,
  source,
}: {
  songs: Song[];
  query: string;
  source: "all" | Song["source"];
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return songs.filter((song) => {
    const sourceMatches = source === "all" || song.source === source;

    if (!sourceMatches) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      song.title,
      song.artist,
      song.caption,
      ...song.tags,
      song.fileType,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}
