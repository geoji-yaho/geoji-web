import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import { toPercent } from "../utils/percent";

const meterBarVariants = cva("relative w-full overflow-hidden rounded-full bg-page", {
	variants: {
		size: {
			md: "h-2",
			sm: "h-1.5"
		}
	},
	defaultVariants: {
		size: "md"
	}
});

const meterFillVariants = cva("block h-full rounded-full", {
	variants: {
		tone: {
			cta: "bg-cta",
			red: "bg-red"
		}
	},
	defaultVariants: {
		tone: "cta"
	}
});

type MeterBarProps = VariantProps<typeof meterBarVariants> &
	VariantProps<typeof meterFillVariants> & {
		value: number;
		max: number;
		markerValue?: number;
		className?: string;
	};

export function MeterBar({ value, max, tone, size, markerValue, className }: MeterBarProps) {
	return (
		<div
			role="meter"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			className={cn(meterBarVariants({ size }), className)}
		>
			<span className={meterFillVariants({ tone })} style={{ width: `${toPercent(value, max)}%` }} />
			{markerValue !== undefined && (
				<span
					aria-hidden="true"
					className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-ink"
					style={{ left: `${toPercent(markerValue, max)}%` }}
				/>
			)}
		</div>
	);
}
