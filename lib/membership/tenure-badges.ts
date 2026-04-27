import type { TenureBadge } from "@/lib/product-types";

export type TenureBadgeDefinition = {
  badge: TenureBadge;
  label: string;
  minimumMonths: number;
  color: string;
};

export const tenureBadges: TenureBadgeDefinition[] = [
  { badge: "legend", label: "Legend", minimumMonths: 12, color: "#191a1d" },
  { badge: "opal", label: "Opal", minimumMonths: 10, color: "#d8f5ff" },
  { badge: "pink_diamond", label: "Pink Diamond", minimumMonths: 9, color: "#ff8ac5" },
  { badge: "diamond", label: "Diamond", minimumMonths: 7, color: "#8bd9ff" },
  { badge: "gold", label: "Gold", minimumMonths: 5, color: "#f2b84b" },
  { badge: "silver", label: "Silver", minimumMonths: 3, color: "#b8c0cc" },
  { badge: "bronze", label: "Bronze", minimumMonths: 1, color: "#b87945" },
  { badge: "new", label: "New Member", minimumMonths: 0, color: "#ded9cf" },
];

export function monthsSince(dateValue: string, now = new Date()) {
  const startedAt = new Date(dateValue);
  const yearDelta = now.getFullYear() - startedAt.getFullYear();
  const monthDelta = now.getMonth() - startedAt.getMonth();

  return Math.max(0, yearDelta * 12 + monthDelta);
}

export function getTenureBadge(memberSince: string, now = new Date()) {
  const activeMonths = monthsSince(memberSince, now);

  return (
    tenureBadges.find((badge) => activeMonths >= badge.minimumMonths) ??
    tenureBadges[tenureBadges.length - 1]
  );
}
