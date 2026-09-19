import { StampSlam } from "@/shared/components/StampSlam";
import { VerdictStamp } from "@/shared/components/VerdictStamp";
import { type Sentence, SENTENCE_LABELS, SENTENCE_NOTES, type Verdict, VERDICT_SIDES } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";

type VerdictHeadlineBlockProps = {
	verdict: Verdict;
	headline: string | null;
	sentence?: Sentence;
	sentenceLabel?: string | null;
	onLand?: () => void;
};

export function VerdictHeadlineBlock({
	verdict,
	headline,
	sentence,
	sentenceLabel,
	onLand
}: VerdictHeadlineBlockProps) {
	const side = VERDICT_SIDES[verdict];
	const label = sentence ? (sentenceLabel ?? SENTENCE_LABELS[sentence]) : null;
	const note = sentence && !sentenceLabel ? SENTENCE_NOTES[sentence] : null;

	return (
		<div className="flex items-center justify-between gap-4 py-1">
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				{headline && (
					<h2 className={cn(side === "none" ? "text-subtitle text-mute" : "text-headline text-ink")}>{headline}</h2>
				)}
				{label && (
					<p className="flex flex-wrap items-baseline gap-1.5">
						<span className="text-caption text-mute">형량</span>
						<span className="text-xl font-black text-red">{label}</span>
						{note && <span className="text-xs text-mute">{note}</span>}
					</p>
				)}
			</div>
			<StampSlam side={side} onLand={onLand} className="shrink-0">
				<VerdictStamp verdict={verdict} size="lg" />
			</StampSlam>
		</div>
	);
}
