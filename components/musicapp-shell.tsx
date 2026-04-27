"use client";

import {
  Archive,
  BadgeCheck,
  Bell,
  Copy,
  Forward,
  Headphones,
  Heart,
  ListMusic,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Radio,
  Repeat2,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Upload,
  UserPlus,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { peopleYouShouldFollow, sampleMessages, sampleSongs } from "@/lib/sample-data";
import { searchAccessibleSongs } from "@/lib/search/search-accessible-songs";
import type { Message, Song, SongSource } from "@/lib/product-types";
import { validateMusicUpload } from "@/lib/validation/music-upload";

const sourceLabels: Record<SongSource, string> = {
  archive: "From Your Personal Archive",
  public: "Public Uploads",
  shared: "Shared With You",
};

function sourceBadgeVariant(source: SongSource) {
  if (source === "archive") {
    return "default" as const;
  }

  if (source === "public") {
    return "accent" as const;
  }

  return "secondary" as const;
}

function getExtension(fileName: string): Song["fileType"] {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "mp4" || extension === "wav" || extension === "flac") {
    return extension;
  }

  return "mp3";
}

function formatTitleFromFile(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replaceAll("-", " ").replaceAll("_", " ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SongArtwork({ song, compact = false }: { song: Song; compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex size-12 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white"
          : "flex size-16 shrink-0 items-center justify-center rounded-md text-base font-semibold text-white"
      }
      style={{ backgroundColor: song.color }}
      aria-hidden="true"
    >
      {initials(song.title)}
    </div>
  );
}

function SongCard({
  song,
  isActive,
  isLiked,
  isReposted,
  onPlay,
  onLike,
  onRepost,
  onPlayNext,
}: {
  song: Song;
  isActive: boolean;
  isLiked: boolean;
  isReposted: boolean;
  onPlay: (song: Song) => void;
  onLike: (songId: string) => void;
  onRepost: (songId: string) => void;
  onPlayNext: (song: Song) => void;
}) {
  return (
    <Card className="group overflow-hidden transition hover:border-primary/40 hover:shadow-sm">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <button
            type="button"
            className="relative shrink-0 rounded-md"
            onClick={() => onPlay(song)}
            aria-label={`Play ${song.title}`}
          >
            <SongArtwork song={song} />
            <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 text-white opacity-0 transition group-hover:opacity-100">
              {isActive ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">{song.title}</h3>
                  <Badge variant={sourceBadgeVariant(song.source)}>{sourceLabels[song.source]}</Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{song.duration}</span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{song.caption}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {song.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
              <Button variant="ghost" size="sm" onClick={() => onLike(song.id)}>
                <Heart data-icon="inline-start" className={isLiked ? "fill-current" : ""} />
                {isLiked ? "Unlike" : "Like"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onRepost(song.id)}>
                <Repeat2 data-icon="inline-start" />
                {isReposted ? "Unrepost" : "Repost"}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 data-icon="inline-start" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Copy data-icon="inline-start" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onPlayNext(song)}>
                <Forward data-icon="inline-start" />
                Play Next
              </Button>
              <Button variant="ghost" size="sm">
                <ListMusic data-icon="inline-start" />
                Playlist
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageBubble({
  message,
  onReact,
  onPlay,
  onPlayNext,
}: {
  message: Message;
  onReact: (messageId: string, reaction: string) => void;
  onPlay: (song: Song) => void;
  onPlayNext: (song: Song) => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [customReaction, setCustomReaction] = React.useState<string | null>(null);

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    setMenuOpen((value) => !value);
  }

  function handleCustomEmoji(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCustomReaction(file.name);
    onReact(message.id, "custom");
  }

  return (
    <div className="relative rounded-lg bg-muted p-3" onContextMenu={handleContextMenu}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{message.sender}</p>
        <span className="text-xs text-muted-foreground">{message.sentAt}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{message.body}</p>

      {message.song ? (
        <div className="mt-3 rounded-lg border border-border bg-card p-3">
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-md"
              onClick={() => message.song && onPlay(message.song)}
              aria-label={`Play ${message.song.title}`}
            >
              <SongArtwork song={message.song} compact />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{message.song.title}</p>
              <p className="truncate text-sm text-muted-foreground">{message.song.artist}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" onClick={() => message.song && onPlay(message.song)}>
                  <Play data-icon="inline-start" />
                  Play
                </Button>
                <Button variant="outline" size="sm" onClick={() => message.song && onPlayNext(message.song)}>
                  Play Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-2 flex items-center gap-1">
        {message.reactions.map((reaction) => (
          <span key={`${message.id}-${reaction}`} className="rounded-md bg-card px-2 py-1 text-xs">
            {reaction}
          </span>
        ))}
        {customReaction ? (
          <span className="rounded-md bg-card px-2 py-1 text-xs">{customReaction}</span>
        ) : null}
      </div>

      {menuOpen ? (
        <div className="absolute right-3 top-10 z-10 flex items-center gap-1 rounded-lg border border-border bg-card p-2 shadow-lg">
          {["🔥", "🎧", "❤️", "✅"].map((reaction) => (
            <button
              key={reaction}
              type="button"
              className="rounded-md px-2 py-1 hover:bg-muted"
              onClick={() => {
                onReact(message.id, reaction);
                setMenuOpen(false);
              }}
            >
              {reaction}
            </button>
          ))}
          <label className="cursor-pointer rounded-md px-2 py-1 text-xs hover:bg-muted">
            GIF
            <input
              className="sr-only"
              type="file"
              accept=".png,.jpg,.jpeg,.gif"
              onChange={handleCustomEmoji}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}

export function MusicAppShell() {
  const [songs, setSongs] = React.useState(sampleSongs);
  const [messages, setMessages] = React.useState(sampleMessages);
  const [source, setSource] = React.useState<"all" | SongSource>("all");
  const [query, setQuery] = React.useState("");
  const [activeSong, setActiveSong] = React.useState<Song>(sampleSongs[0]);
  const [likedSongs, setLikedSongs] = React.useState<Set<string>>(() => new Set());
  const [repostedSongs, setRepostedSongs] = React.useState<Set<string>>(() => new Set());
  const [queue, setQueue] = React.useState<Song[]>([sampleSongs[3], sampleSongs[2]]);
  const [uploadStatus, setUploadStatus] = React.useState("Email verified. Uploads are enabled.");
  const [messageDraft, setMessageDraft] = React.useState("");

  const accessibleSongs = React.useMemo(
    () => searchAccessibleSongs({ songs, query, source }),
    [songs, query, source],
  );

  function toggleSongInSet(songId: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) {
    setter((current) => {
      const next = new Set(current);

      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }

      return next;
    });
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validation = validateMusicUpload({ name: file.name, size: file.size });

    if (!validation.allowed) {
      setUploadStatus(validation.reason);
      return;
    }

    const uploadedSong: Song = {
      id: `song-upload-${Date.now()}`,
      title: formatTitleFromFile(file.name),
      artist: "You",
      caption: "saved to your archive #newupload",
      duration: "0:00",
      fileType: getExtension(file.name),
      source: "archive",
      visibility: "private",
      tags: ["newupload"],
      likes: 0,
      comments: 0,
      reposts: 0,
      color: "#191a1d",
    };

    setSongs((current) => [uploadedSong, ...current]);
    setActiveSong(uploadedSong);
    setUploadStatus(`${file.name} added to From Your Personal Archive.`);
  }

  function handleReact(messageId: string, reaction: string) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId && !message.reactions.includes(reaction)
          ? { ...message, reactions: [...message.reactions, reaction] }
          : message,
      ),
    );
  }

  function sendMessage() {
    const body = messageDraft.trim();

    if (!body) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `message-${Date.now()}`,
        sender: "You",
        body,
        sentAt: "Now",
        reactions: [],
      },
    ]);
    setMessageDraft("");
  }

  function addToQueue(song: Song) {
    setQueue((current) => [song, ...current.filter((queuedSong) => queuedSong.id !== song.id)]);
  }

  return (
    <main className="min-h-screen pb-28">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="border-b border-border bg-card/80 p-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-foreground text-background">
              <Headphones data-icon="inline-start" />
            </div>
            <div>
              <p className="text-lg font-semibold">musicapp</p>
              <p className="text-xs text-muted-foreground">verified music sharing</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-row gap-2 overflow-x-auto lg:flex-col">
            {[
              { label: "Home", icon: Radio },
              { label: "Search", icon: Search },
              { label: "Archive", icon: Archive },
              { label: "Messages", icon: MessageCircle },
              { label: "Upload", icon: Upload },
            ].map((item) => (
              <Button key={item.label} variant={item.label === "Home" ? "default" : "ghost"} className="justify-start">
                <item.icon data-icon="inline-start" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck data-icon="inline-start" />
              <p className="text-sm font-medium">Email verified</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Uploads, messages, comments, and follows are active.</p>
          </div>
        </aside>

        <section className="p-4 md:p-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <h1 className="text-3xl font-semibold tracking-normal">Your music network</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell data-icon="inline-start" />
              </Button>
              <label>
                <input className="sr-only" type="file" accept=".mp3,.mp4,.wav,.flac" onChange={handleUpload} />
                <span className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  <Upload data-icon="inline-start" />
                  Upload
                </span>
              </label>
            </div>
          </header>

          <div className="mt-6 rounded-lg border border-border bg-card p-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search songs, artists, albums, people, hashtags"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "From Your Personal Archive", value: "archive" },
                  { label: "Public Uploads", value: "public" },
                  { label: "Shared With You", value: "shared" },
                ].map((item) => (
                  <Button
                    key={item.value}
                    variant={source === item.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSource(item.value as "all" | SongSource)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{uploadStatus}</p>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-3">
              {accessibleSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isActive={activeSong.id === song.id}
                  isLiked={likedSongs.has(song.id)}
                  isReposted={repostedSongs.has(song.id)}
                  onPlay={setActiveSong}
                  onLike={(songId) => toggleSongInSet(songId, setLikedSongs)}
                  onRepost={(songId) => toggleSongInSet(songId, setRepostedSongs)}
                  onPlayNext={addToQueue}
                />
              ))}
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h2 className="text-base font-semibold">Messages</h2>
                  <p className="text-sm text-muted-foreground">Mina Coast</p>
                </div>
                <Button variant="ghost" size="icon" aria-label="More message actions">
                  <MoreHorizontal data-icon="inline-start" />
                </Button>
              </div>
              <Separator />
              <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onReact={handleReact}
                    onPlay={setActiveSong}
                    onPlayNext={addToQueue}
                  />
                ))}
              </div>
              <Separator />
              <div className="flex gap-2 p-4">
                <Input
                  placeholder="Send a message"
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={sendMessage} aria-label="Send message">
                  <Send data-icon="inline-start" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <aside className="border-t border-border bg-card/80 p-4 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">PEOPLE YOU SHOULD FOLLOW</h2>
            <Button variant="ghost" size="icon" aria-label="Add people">
              <UserPlus data-icon="inline-start" />
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {peopleYouShouldFollow.map((person) => (
              <div key={person.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white"
                  style={{ backgroundColor: person.color }}
                >
                  {initials(person.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm font-medium">{person.name}</p>
                    {person.verified ? <BadgeCheck className="text-primary" data-icon="inline-start" /> : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{person.handle}</p>
                  <p className="truncate text-xs text-muted-foreground">{person.reason}</p>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-background p-4">
            <h2 className="text-sm font-semibold">Up next</h2>
            <div className="mt-3 flex flex-col gap-3">
              {queue.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  className="flex items-center gap-3 rounded-md text-left"
                  onClick={() => setActiveSong(song)}
                >
                  <SongArtwork song={song} compact />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{song.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <SongArtwork song={activeSong} compact />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{activeSong.title}</p>
              <Badge variant={sourceBadgeVariant(activeSong.source)}>{sourceLabels[activeSong.source]}</Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{activeSong.artist}</p>
            <div className="mt-2 h-1 rounded-full bg-muted">
              <div className="h-1 w-1/3 rounded-full bg-primary" />
            </div>
          </div>
          <Button size="icon" aria-label="Play or pause">
            <Pause data-icon="inline-start" />
          </Button>
          <Button variant="outline" onClick={() => addToQueue(activeSong)}>
            <Forward data-icon="inline-start" />
            Play Next
          </Button>
        </div>
      </div>
    </main>
  );
}
