import { useId, useState } from "react";

const HINT_SUFFIX = "산식 보기";

type StatBoxProps = {
	label: string;
	value: string;
	hint?: string;
};

export function StatBox({ label, value, hint }: StatBoxProps) {
	const [hintOpen, setHintOpen] = useState(false);
	const hintId = useId();

	return (
		<div className="flex flex-1 flex-col rounded-xl bg-fill px-3 py-2.5">
			<span className="flex h-4 items-center gap-1 text-caption text-mute">
				{label}
				{hint && (
					<button
						type="button"
						aria-label={`${label} ${HINT_SUFFIX}`}
						aria-expanded={hintOpen}
						aria-controls={hintId}
						onClick={() => setHintOpen((prev) => !prev)}
						className="-m-2.5 inline-flex shrink-0 pressable items-center justify-center p-2.5"
					>
						<span
							aria-hidden="true"
							className="inline-flex size-4 items-center justify-center rounded-full border border-line leading-none"
						>
							?
						</span>
					</button>
				)}
			</span>
			<p className="text-title text-ink">{value}</p>
			{hint && (
				<p id={hintId} hidden={!hintOpen} className="pt-1 text-caption text-mute">
					{hint}
				</p>
			)}
		</div>
	);
}
