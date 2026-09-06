type EmptyStateProps = {
	title: string;
	description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-10 text-center">
			<span aria-hidden="true" className="text-[56px]">
				💰
			</span>
			<p className="text-[15px] font-black text-ink">{title}</p>
			<p className="text-sm leading-relaxed whitespace-pre-line text-muted">{description}</p>
		</div>
	);
}
