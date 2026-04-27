import { z } from "zod";

export const allowedMusicExtensions = [".mp3", ".mp4", ".wav", ".flac"] as const;
export const allowedImageExtensions = [".png", ".jpg", ".jpeg", ".gif"] as const;

const musicFileSchema = z.object({
  name: z.string().min(1),
  size: z.number().positive(),
});

export function isAllowedMusicFileName(fileName: string) {
  const normalizedName = fileName.toLowerCase();

  return allowedMusicExtensions.some((extension) =>
    normalizedName.endsWith(extension),
  );
}

export function validateMusicUpload(input: unknown) {
  const file = musicFileSchema.parse(input);

  if (!isAllowedMusicFileName(file.name)) {
    return {
      allowed: false,
      reason: "Only .mp3, .mp4, .wav, and .flac music files are allowed.",
    };
  }

  return {
    allowed: true,
    reason: "Music file type is allowed.",
  };
}
