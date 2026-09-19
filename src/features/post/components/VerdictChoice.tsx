import type { PostType } from "@/shared/domain/post";
import { VERDICT_LABELS, type VerdictSide, VOTE_VERDICTS } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";

export type VoteSide = Exclude<VerdictSide, "none">;

const SIDE_TONES: Record<VoteSide, string> = {
	oppose: "bg-red",
	support: "bg-green"
};

const CHOICE_NOTES: Record<PostType, Record<VoteSide, string>> = {
	spent: { oppose: "변론 인정 안 함", support: "그럴 수 있음" },
	considering: { oppose: "사지 마세요", support: "사도 됩니다" }
};

const SIDES: VoteSide[] = ["oppose", "support"];

type VerdictChoiceProps = {
	postType: PostType;
	value: VoteSide | null;
	onChange: (side: VoteSide) => void;
};

export function VerdictChoice({ postType, value, onChange }: VerdictChoiceProps) {
	const verdicts = VOTE_VERDICTS[postType];
	const notes = CHOICE_NOTES[postType];

	return (
		<div className="flex gap-2.5">
			{SIDES.map((side) => {
				const selected = side === value;

				return (
					<button
						key={side}
						type="button"
						aria-pressed={selected}
						onClick={() => onChange(side)}
						className={cn(
							"flex flex-1 pressable flex-col items-center gap-1 rounded-2xl bg-card px-3 py-4.5 text-ink shadow-card",
							selected && [SIDE_TONES[side], "text-stamp-text shadow-cta"]
						)}
					>
						<span className="text-stamp-md">{VERDICT_LABELS[verdicts[side]]}</span>
						<span className={cn("text-caption text-mute", selected && "text-stamp-text/85")}>{notes[side]}</span>
					</button>
				);
			})}
		</div>
	);
}
