type StatBoxProps = {
	label: string;
	value: string;
	hint?: string;
};

export function StatBox({ label, value, hint }: StatBoxProps) {
	return (
		<div className="flex flex-1 flex-col rounded-xl bg-fill px-3 py-2.5">
			<span className="flex h-4 items-center gap-1 text-caption text-mute">
				{label}
				{hint && (
					<>
						<span
							title={hint}
							aria-hidden="true"
							className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-line leading-none"
						>
							?
						</span>
						<span className="sr-only">{hint}</span>
					</>
				)}
			</span>
			<p className="text-title text-ink">{value}</p>
		</div>
	);
}
