import { expect, test } from "@playwright/test";

test("home screen supports archive search and playable message cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Archiv")).toBeVisible();
  await expect(page.getByText("From Your Personal Archive").first()).toBeVisible();
  await expect(page.getByText("PEOPLE YOU SHOULD FOLLOW")).toBeVisible();
  await expect(page.getByText("Messages")).toBeVisible();

  await page.getByPlaceholder("Search songs, artists, albums, people, hashtags").fill("cloudrap");

  await expect(page.getByText("Late Room Demo")).toBeVisible();
  await expect(page.getByText("Signal Bloom")).not.toBeVisible();

  await page.getByRole("button", { name: "Play Noon Loop" }).click();

  await expect(page.getByText("Noon Loop").last()).toBeVisible();
});
