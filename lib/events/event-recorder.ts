export type ProductEventName =
  | "song_uploaded"
  | "song_played"
  | "song_shared"
  | "song_liked"
  | "song_reposted"
  | "message_sent";

export async function recordProductEvent(input: {
  userId: string;
  name: ProductEventName;
  properties?: Record<string, string | number | boolean>;
}) {
  console.info("Local product event", input);
}
