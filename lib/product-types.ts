export type SongSource = "archive" | "public" | "shared";

export type SongVisibility = "private" | "public";

export type MembershipPlan = "free" | "plus";

export type TenureBadge =
  | "new"
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "pink_diamond"
  | "opal"
  | "legend";

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

export type ListeningStatus = {
  source: "musicapp" | "lastfm";
  title: string;
  artist: string;
  isNowPlaying: boolean;
  listenedAtLabel: string;
};

export type LastFmConnection = {
  username: string;
  connected: boolean;
  recentTrack: ListeningStatus;
};

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  verified: boolean;
  memberSince: string;
  membershipPlan: MembershipPlan;
  bannerUrl: string;
  bannerFileType: "png" | "jpg" | "jpeg" | "gif";
  lastFm: LastFmConnection;
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
