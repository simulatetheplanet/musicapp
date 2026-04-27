export type SongSource = "archive" | "public" | "shared";

export type SongVisibility = "private" | "public";

export type Song = {
  id: string;
  title: string;
  artist: string;
  caption: string;
  duration: string;
  fileType: "mp3" | "mp4" | "wav" | "flac";
  source: SongSource;
  visibility: SongVisibility;
  tags: string[];
  likes: number;
  comments: number;
  reposts: number;
  color: string;
};

export type PersonRecommendation = {
  id: string;
  name: string;
  handle: string;
  reason: string;
  verified: boolean;
  color: string;
};

export type Message = {
  id: string;
  sender: string;
  body: string;
  sentAt: string;
  song?: Song;
  reactions: string[];
};
