import type { PostType } from "@/shared/domain/post";
import { VERDICT_LABELS, type VerdictSide, VOTE_VERDICTS } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";

export type VoteSide = Exclude<VerdictSide, "none">;

const CHOICES: { side: VoteSide; note: string; selectedTone: string }[] = [
	{ side: "oppose", note: "변론 인정 안 함", selectedTone: "bg-red" },
	{ side: "support", note: "그럴 수 있음", selectedTone: "bg-green" }
];

type VerdictChoiceProps = {
	postType: PostType;
	value: VoteSide;
	onChange: (side: VoteSide) => void;
};

export function VerdictChoice({ postType, value, onChange }: VerdictChoiceProps) {
	const verdicts = VOTE_VERDICTS[postType];

	return (
		<div className="flex gap-2.5">
			{CHOICES.map(({ side, note, selectedTone }) => {
				const selected = side === value;

				return (
					<button
						key={side}
						type="button"
						aria-pressed={selected}
						onClick={() => onChange(side)}
						className={cn(
							"flex flex-1 pressable flex-col items-center gap-1 rounded-2xl bg-card px-3 py-4.5 text-mute shadow-card",
							selected && [selectedTone, "text-stamp-text shadow-cta"]
						)}
					>
						<span className="text-stamp-md">{VERDICT_LABELS[verdicts[side]]}</span>
						<span className={cn("text-caption", selected && "text-stamp-text/85")}>{note}</span>
					</button>
				);
			})}
		</div>
	);
}
