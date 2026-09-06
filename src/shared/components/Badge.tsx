type TagBadgeProps = {
	label: string;
	tone?: "soft" | "outline";
};

export function TagBadge({ label, tone = "soft" }: TagBadgeProps) {
	return (
		<span
			className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
				tone === "soft" ? "bg-terracotta-soft text-terracotta" : "border border-line text-ink"
			}`}
		>
			{label}
		</span>
	);
}

export function CountBadge({ count }: { count: number }) {
	return (
		<span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-surface">
			{count}
		</span>
	);
}
