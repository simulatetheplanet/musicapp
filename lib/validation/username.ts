import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Usernames must be at least 3 characters.")
  .max(24, "Usernames must be 24 characters or fewer.")
  .regex(
    /^[a-z0-9._]+$/,
    "Usernames can only use lowercase letters, numbers, periods, and underscores.",
  )
  .refine((value) => !value.includes(".."), {
    message: "Usernames cannot contain two periods in a row.",
  })
  .refine((value) => !value.startsWith(".") && !value.endsWith("."), {
    message: "Usernames cannot start or end with a period.",
  });

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validateUniqueUsername(input: string, takenUsernames: string[]) {
  const username = normalizeUsername(input);
  const parsed = usernameSchema.safeParse(username);

  if (!parsed.success) {
    return {
      available: false,
      username,
      reason: parsed.error.issues[0]?.message ?? "Username is not valid.",
    };
  }

  if (takenUsernames.includes(username)) {
    return {
      available: false,
      username,
      reason: "That username is already taken.",
    };
  }

  return {
    available: true,
    username,
    reason: "Username is available.",
  };
}
