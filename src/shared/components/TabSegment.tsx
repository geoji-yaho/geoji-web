import { cn } from "../lib/cn";

type TabSegmentProps<T extends string> = {
	tabs: readonly T[];
	value: T;
	onChange: (tab: T) => void;
	className?: string;
};

export function TabSegment<T extends string>({ tabs, value, onChange, className }: TabSegmentProps<T>) {
	return (
		<div role="tablist" className={cn("flex rounded-full bg-page p-1", className)}>
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
							"flex-1 rounded-full py-2 text-control font-bold text-mute transition-colors",
							selected && "bg-ink font-black text-card"
						)}
					>
						{tab}
					</button>
				);
			})}
		</div>
	);
}
