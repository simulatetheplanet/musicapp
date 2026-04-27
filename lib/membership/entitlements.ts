import type { MembershipPlan } from "@/lib/product-types";

export type MembershipEntitlements = {
  plan: MembershipPlan;
  label: string;
  monthlyPriceUsd: number;
  hasAds: boolean;
  dmFileLimitMb: number;
  groupChatFileLimitMb: number;
  canUseCustomEmojis: boolean;
};

export const membershipEntitlements: Record<MembershipPlan, MembershipEntitlements> = {
  free: {
    plan: "free",
    label: "Free Member",
    monthlyPriceUsd: 0,
    hasAds: true,
    dmFileLimitMb: 25,
    groupChatFileLimitMb: 25,
    canUseCustomEmojis: false,
  },
  plus: {
    plan: "plus",
    label: "Plus Member",
    monthlyPriceUsd: 5,
    hasAds: false,
    dmFileLimitMb: 50,
    groupChatFileLimitMb: 50,
    canUseCustomEmojis: true,
  },
};

export function getMembershipEntitlements(plan: MembershipPlan) {
  return membershipEntitlements[plan];
}
