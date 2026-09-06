import { Fragment } from "react";

import { type Tier, TIER_LABELS } from "../domain/tier";
import { cn } from "../lib/cn";
import { LogoIcon } from "./LogoIcon";
import { TierCoin } from "./TierCoin";

const TIER_TRACK_ORDER: Tier[] = ["penniless", "hardcore", "flower", "king"];

type TierTrackProps = {
	tier: Tier;
	className?: string;
};

export function TierTrack({ tier, className }: TierTrackProps) {
	const currentIndex = TIER_TRACK_ORDER.indexOf(tier);

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<div aria-hidden="true" className="flex items-center">
				{TIER_TRACK_ORDER.map((step, index) => (
					<Fragment key={step}>
						{index > 0 && (
							<span aria-hidden="true" className={cn("h-0.5 flex-1", index <= currentIndex ? "bg-tan" : "bg-line")} />
						)}
						{index === currentIndex ? (
							<LogoIcon className="size-10 drop-shadow-md" />
						) : (
							<TierCoin filled={index < currentIndex} />
						)}
					</Fragment>
				))}
			</div>
			<ol className="flex justify-between">
				{TIER_TRACK_ORDER.map((step) => (
					<li
						key={step}
						aria-current={step === tier ? "step" : undefined}
						className={cn("text-caption", step === tier ? "font-black text-red" : "text-dim")}
					>
						{TIER_LABELS[step]}
					</li>
				))}
			</ol>
		</div>
	);
}
