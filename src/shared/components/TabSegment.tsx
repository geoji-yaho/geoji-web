type TabSegmentProps<T extends string> = {
	tabs: readonly T[];
	value: T;
	onChange: (tab: T) => void;
};

export function TabSegment<T extends string>({ tabs, value, onChange }: TabSegmentProps<T>) {
	return (
		<div className="flex gap-1 rounded-full bg-line p-1" role="tablist">
			{tabs.map((tab) => {
				const selected = tab === value;

				return (
					<button
						key={tab}
						type="button"
						role="tab"
						aria-selected={selected}
						onClick={() => onChange(tab)}
						className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
							selected ? "bg-ink text-card" : "text-muted"
						}`}
					>
						{tab}
					</button>
				);
			})}
		</div>
	);
}
