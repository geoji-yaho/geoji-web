import { StampSlam } from "@/shared/components/StampSlam";
import { VerdictStamp } from "@/shared/components/VerdictStamp";
import { type Sentence, SENTENCE_LABELS, SENTENCE_NOTES, type Verdict, VERDICT_SIDES } from "@/shared/domain/verdict";

type VerdictHeadlineBlockProps = {
	verdict: Verdict;
	headline: string;
	sentence: Sentence;
	onUnstamp: () => void;
	onLand?: () => void;
};

export function VerdictHeadlineBlock({ verdict, headline, sentence, onUnstamp, onLand }: VerdictHeadlineBlockProps) {
	const note = SENTENCE_NOTES[sentence];

	return (
		<button
			type="button"
			onClick={onUnstamp}
			className="flex w-full pressable items-center justify-between gap-4 py-1 text-left"
		>
			<span className="flex min-w-0 flex-1 flex-col gap-1.5">
				<span className="text-headline text-ink">{headline}</span>
				<span className="flex flex-wrap items-baseline gap-1.5">
					<span className="text-caption text-mute">형량</span>
					<span className="text-xl font-black text-red">{SENTENCE_LABELS[sentence]}</span>
					{note && <span className="text-xs text-mute">{note}</span>}
				</span>
			</span>
			<StampSlam side={VERDICT_SIDES[verdict]} onLand={onLand} className="shrink-0">
				<VerdictStamp verdict={verdict} size="lg" />
			</StampSlam>
		</button>
	);
}
