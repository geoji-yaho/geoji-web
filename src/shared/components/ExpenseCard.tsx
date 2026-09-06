import type { ImageSource, PostType, Reaction } from "../types/post";
import type { Tier } from "../types/tier";
import {
	type Sentence,
	SENTENCE_LABELS,
	SENTENCE_NOTES,
	type Verdict,
	VERDICT_LABELS,
	VOTE_VERDICTS,
	type VoteTally
} from "../types/verdict";
import { formatAmount } from "../utils/format";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { MemeThumbnail } from "./MemeThumbnail";
import { TallyRow } from "./ProgressBar";
import { ReactionRow } from "./ReactionRow";
import { PostTypeTag, StatusTag } from "./Tag";
import { TierBadge } from "./TierBadge";
import { VerdictStamp } from "./VerdictStamp";

type ExpenseCardBase = {
	name: string;
	tier: Tier;
	timeAgo: string;
	/** 형 집행 중이면 상단에 붙는 뱃지 문구. 예: 수감 중 2일 */
	imprisonedLabel?: string;
	postType: PostType;
	category: string;
	/** 무엇을 샀는지. 지출 등록의 필수 항목 */
	title: string;
	amount: number;
	/** 변론. 선택 항목이라 없을 수 있다 */
	memo?: string;
	image?: ImageSource;
	reactions: Reaction[];
	commentCount: number;
	onComments?: () => void;
};

type VotingProps = {
	state: "voting";
	deadlineLabel: string;
	tally: VoteTally;
	/** 투표 가능 인원. n/m 투표의 m */
	eligibleCount: number;
	/** open은 투표 가능, voted는 이미 투표함, own은 본인 게시물 */
	voteState: "open" | "voted" | "own";
	onVote?: () => void;
};

type JudgedProps = {
	state: "judged";
	verdict: Exclude<Verdict, "dismissed">;
	tally: VoteTally;
	/** 유죄일 때만 있다 */
	sentence?: Sentence;
	headline: string;
	meme?: ImageSource;
	onOpenVerdict?: () => void;
};

type DismissedProps = {
	state: "dismissed";
};

type ExpenseCardProps = ExpenseCardBase & (VotingProps | JudgedProps | DismissedProps);

export function ExpenseCard(props: ExpenseCardProps) {
	const { oppose, support } = VOTE_VERDICTS[props.postType];

	return (
		<article className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-card">
			<div className="flex items-start gap-2.5">
				<Avatar name={props.name} />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-1.5">
						<span className="text-sm font-black text-ink">{props.name}</span>
						<TierBadge tier={props.tier} />
						{props.imprisonedLabel && <StatusTag label={props.imprisonedLabel} />}
					</div>
					<span className="text-caption text-dim">{props.timeAgo}</span>
				</div>
				<PostTypeTag postType={props.postType} />
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-xs text-mute">
					{props.category} · {props.title}
				</span>
				<p className="text-amount-sm text-ink">{formatAmount(props.amount)}원</p>
				{props.memo && <p className="text-sm text-text">&ldquo;{props.memo}&rdquo;</p>}
				{props.image && (
					<img
						src={props.image.src}
						alt={props.image.alt}
						className="mt-1 h-40 w-full rounded-2xl bg-fill object-cover"
					/>
				)}
			</div>

			<div className="flex flex-col gap-2.5 border-t border-line pt-3">
				{props.state === "voting" && (
					<>
						<div className="flex items-center justify-between text-xs">
							<span className="font-extrabold text-red">◷ {props.deadlineLabel}</span>
							<span className="text-dim">
								{props.tally.oppose + props.tally.support}/{props.eligibleCount} 투표
							</span>
						</div>
						<TallyRow tally={props.tally} opposeLabel={VERDICT_LABELS[oppose]} supportLabel={VERDICT_LABELS[support]} />
						<Button variant="ink" disabled={props.voteState !== "open"} onClick={props.onVote}>
							{props.voteState === "voted" ? "투표 완료" : "투표하기"}
						</Button>
						{props.voteState === "own" && (
							<span className="text-center text-caption text-dim">본인의 재판에는 투표할 수 없습니다</span>
						)}
					</>
				)}

				{props.state === "judged" && (
					<>
						<div className="flex items-start gap-3">
							<VerdictStamp verdict={props.verdict} />
							<div className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-mute">
								<span>
									배심원 평결{" "}
									<b className="font-black text-ink">
										{props.tally.oppose} : {props.tally.support}
									</b>
								</span>
								{props.sentence && (
									<span>
										AI 판사 선고 <b className="font-black text-red">{SENTENCE_LABELS[props.sentence]}</b>
										{SENTENCE_NOTES[props.sentence] && ` (${SENTENCE_NOTES[props.sentence]})`}
									</span>
								)}
								<span className="text-control text-text">&ldquo;{props.headline}&rdquo;</span>
							</div>
							<MemeThumbnail meme={props.meme} />
						</div>
						<Button variant="outline" onClick={props.onOpenVerdict}>
							판결문 보기
						</Button>
					</>
				)}

				{props.state === "dismissed" && (
					<div className="flex items-center gap-3">
						<VerdictStamp verdict="dismissed" />
						<span className="text-control font-bold text-mute">각하 (정족수 미달)</span>
					</div>
				)}

				<ReactionRow reactions={props.reactions} commentCount={props.commentCount} onComments={props.onComments} />
			</div>
		</article>
	);
}
