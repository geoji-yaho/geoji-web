import { cva } from "class-variance-authority";

import { cn } from "../lib/cn";
import { type Tier, TIER_LABELS } from "../types/tier";

const tierBadgeVariants = cva("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-tag font-black", {
	variants: {
		tier: {
			penniless: "bg-fill text-mute",
			hardcore: "bg-line text-ink",
			flower: "bg-ink text-card",
			king: "bg-cta text-ink"
		}
	}
});

type TierBadgeProps = {
	tier: Tier;
	className?: string;
};

export function TierBadge({ tier, className }: TierBadgeProps) {
	return <span className={cn(tierBadgeVariants({ tier }), className)}>{TIER_LABELS[tier]}</span>;
}
