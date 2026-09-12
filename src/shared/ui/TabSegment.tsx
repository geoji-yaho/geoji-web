import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "../lib/cn";

const SEGMENT_SPRING = { type: "spring", stiffness: 500, damping: 40 } as const;

type TabSegmentProps<T extends string | number> = {
	tabs: readonly T[];
	value: T;
	onChange: (tab: T) => void;
	renderLabel?: (tab: T) => string;
	className?: string;
};

export function TabSegment<T extends string | number>({
	tabs,
	value,
	onChange,
	renderLabel,
	className
}: TabSegmentProps<T>) {
	const layoutId = useId();

	return (
		<div role="tablist" className={cn("flex rounded-2xl bg-card p-1", className)}>
			{tabs.map((tab) => {
				const selected = tab === value;

				return (
					<button
						key={tab}
						type="button"
						role="tab"
						aria-selected={selected}
						onClick={() => onChange(tab)}
						className={cn(
							"relative flex-1 pressable rounded-full py-2 text-control font-bold text-mute",
							selected && "font-black text-card"
						)}
					>
						{selected && (
							<motion.span
								aria-hidden="true"
								layoutId={layoutId}
								transition={SEGMENT_SPRING}
								className="absolute inset-0 rounded-full bg-ink"
							/>
						)}
						<span className="relative z-10">{renderLabel ? renderLabel(tab) : tab}</span>
					</button>
				);
			})}
		</div>
	);
}
