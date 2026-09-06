import { TagBadge } from "./Badge";
import { MeterBar, SplitBar } from "./ProgressBar";
import { VerdictStamp } from "./VerdictBadge";

type VerdictPanelProps = {
	headline: string;
	sentenceLabel: string;
	sentenceValue: string;
	stampLabel: string;
	juryGuilty: number;
	juryNotGuilty: number;
	juryNote: string;
	intensityLabel: string;
	judgeMessage: string;
	executionStatusLabel: string;
	executionRemainingLabel: string;
	executionValue: number;
	executionMax: number;
};

export function VerdictPanel({
	headline,
	sentenceLabel,
	sentenceValue,
	stampLabel,
	juryGuilty,
	juryNotGuilty,
	juryNote,
	intensityLabel,
	judgeMessage,
	executionStatusLabel,
	executionRemainingLabel,
	executionValue,
	executionMax
}: VerdictPanelProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-2xl font-black text-ink">{headline}</h2>
					<p className="mt-1 text-sm text-muted">
						{sentenceLabel} <span className="font-bold text-terracotta">{sentenceValue}</span>
					</p>
				</div>
				<VerdictStamp label={stampLabel} size="lg" />
			</div>

			<div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
				<span className="text-xs font-bold text-muted">배심원 평결</span>
				<SplitBar leftValue={juryGuilty} rightValue={juryNotGuilty} />
				<div className="flex items-center justify-between text-sm font-bold">
					<span className="text-terracotta">유죄 {juryGuilty}</span>
					<span className="text-praise">무죄 {juryNotGuilty}</span>
				</div>
				<span className="text-xs text-muted">{juryNote}</span>
			</div>

			<div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
				<div className="flex items-center gap-2">
					<span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-surface">
						판
					</span>
					<span className="text-sm font-bold text-ink">AI 판사 선고</span>
					<TagBadge label={intensityLabel} />
				</div>
				<p className="text-sm leading-relaxed text-ink">
					{judgeMessage}
					<span className="animate-pulse">▌</span>
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between text-sm">
					<span className="font-bold text-terracotta">{executionStatusLabel}</span>
					<span className="text-muted">{executionRemainingLabel}</span>
				</div>
				<MeterBar value={executionValue} max={executionMax} tone="terracotta" />
			</div>
		</div>
	);
}
