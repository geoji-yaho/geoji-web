import { cn } from "../lib/cn";
import type { ImageSource, PostType } from "../types/post";
import type { Intensity } from "../types/room";
import {
	type Execution,
	EXECUTION_LABELS,
	type Sentence,
	SENTENCE_LABELS,
	SENTENCE_NOTES,
	type Verdict,
	VERDICT_LABELS,
	VERDICT_SIDES,
	VOTE_VERDICTS,
	type VoteTally
} from "../types/verdict";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { MemeThumbnail } from "./MemeThumbnail";
import { ExecutionMeter, TallyRow } from "./ProgressBar";
import { IntensityTag } from "./Tag";
import { VerdictStamp } from "./VerdictStamp";

type Voter = {
	name: string;
	verdict: Verdict;
};

type VerdictPanelProps = {
	verdict: Verdict;
	postType: PostType;
	/** AI가 쓴 한 문장. 각하면 없다 */
	headline?: string;
	/** 유죄일 때만 있다 */
	sentence?: Sentence;
	meme?: ImageSource;
	tally: VoteTally;
	voters?: Voter[];
	/** 참고된 방 규칙 한 줄 */
	ruleNote?: string;
	intensity: Intensity;
	judgeMessage: string;
	/** 양형 이유. 감경과 가중 사유를 따로 강조한다 */
	sentencingReason?: string;
	/** 판결문이 글자 단위로 도착하는 중이면 커서를 보인다 */
	streaming?: boolean;
	/** AI 호출이 실패해 템플릿으로 채운 판결문이면 AI 판사 라벨과 양형 이유를 숨긴다 */
	fallback?: boolean;
	/** 유죄에 형량이 있을 때만 넘긴다 */
	execution?: Execution;
	className?: string;
};

export function VerdictPanel({
	verdict,
	postType,
	headline,
	sentence,
	meme,
	tally,
	voters,
	ruleNote,
	intensity,
	judgeMessage,
	sentencingReason,
	streaming = false,
	fallback = false,
	execution,
	className
}: VerdictPanelProps) {
	const dismissed = verdict === "dismissed";
	const { oppose, support } = VOTE_VERDICTS[postType];

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex items-start justify-between gap-4 py-1">
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					{headline && <h2 className="text-headline text-ink">{headline}</h2>}
					{sentence && (
						<p className="flex flex-wrap items-baseline gap-1.5">
							<span className="text-caption text-mute">형량</span>
							<span className="text-xl font-black text-red">{SENTENCE_LABELS[sentence]}</span>
							{SENTENCE_NOTES[sentence] && <span className="text-xs text-mute">{SENTENCE_NOTES[sentence]}</span>}
						</p>
					)}
				</div>
				<VerdictStamp verdict={verdict} size="lg" />
			</div>

			{!dismissed && <MemeThumbnail meme={meme} size="lg" />}

			<Card className="flex flex-col gap-2.5 p-4">
				<h3 className="text-label text-mute">배심원 평결</h3>
				<TallyRow tally={tally} opposeLabel={VERDICT_LABELS[oppose]} supportLabel={VERDICT_LABELS[support]} />
				{voters && voters.length > 0 && (
					<ul className="flex flex-wrap gap-2">
						{voters.map((voter) => (
							<li key={voter.name} className="flex items-center gap-1 text-caption text-mute">
								<Avatar name={voter.name} size="xs" />
								{voter.name}
								<b className={cn("font-black", VERDICT_SIDES[voter.verdict] === "oppose" ? "text-red" : "text-green")}>
									{VERDICT_LABELS[voter.verdict]}
								</b>
							</li>
						))}
					</ul>
				)}
				{ruleNote && <p className="text-xs text-mute">참고 규칙 · {ruleNote}</p>}
			</Card>

			{dismissed ? (
				<Card className="p-4 text-body text-text">배심원이 모이지 않아 각하되었습니다</Card>
			) : (
				<Card className="flex flex-col gap-2.5 p-4">
					{!fallback && (
						<div className="flex items-center gap-2">
							<Avatar name="판" size="xs" className="size-6.5 bg-ink text-card" />
							<h3 className="text-xs font-black text-ink">AI 판사 선고</h3>
							<IntensityTag intensity={intensity} />
						</div>
					)}
					<p className="text-body text-text">
						{judgeMessage}
						{streaming && (
							<span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-ink align-middle" />
						)}
					</p>
					{!fallback && sentencingReason && (
						<p className="rounded-xl bg-fill px-3 py-2.5 text-chip font-bold text-ink">{sentencingReason}</p>
					)}
					{!fallback && <p className="text-caption text-dim">판결문은 AI가 작성했습니다</p>}
				</Card>
			)}

			{execution && <ExecutionCard execution={execution} />}
		</div>
	);
}

function ExecutionCard({ execution }: { execution: Execution }) {
	const { status, daysLeft, totalDays } = execution;
	const active = status === "active";

	return (
		<Card className="flex flex-col gap-2 px-4 py-3.25">
			<div className="flex items-center justify-between text-control">
				<span className="font-black text-red">
					{EXECUTION_LABELS[status]}
					{active && ` · D-${daysLeft}`}
				</span>
				{active && <span className="text-mute">남은 무지출 {daysLeft}일</span>}
			</div>
			<ExecutionMeter daysLeft={daysLeft} totalDays={totalDays} />
		</Card>
	);
}
