import type { ImageSource, PostType, Reaction } from "../domain/post";
import type { Tier } from "../domain/tier";
import {
	type Sentence,
	SENTENCE_LABELS,
	SENTENCE_NOTES,
	type Verdict,
	VERDICT_LABELS,
	VOTE_VERDICTS,
	type VoteTally
} from "../domain/verdict";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatAmount } from "../utils/format";
import { PostTypeTag } from "./PostTypeTag";
import { ReactionRow } from "./ReactionRow";
import { StatusTag } from "./StatusTag";
import { TallyRow } from "./TallyRow";
import { TierBadge } from "./TierBadge";
import { VerdictStamp } from "./VerdictStamp";

type ExpenseCardBase = {
	name: string;
	tier: Tier;
	timeAgo: string;
	imprisonedLabel?: string;
	postType: PostType;
	category: string;
	title: string;
	amount: number;
	memo?: string;
	image?: ImageSource;
};

type VotingProps = {
	state: "voting";
	reactions: Reaction[];
	commentCount: number;
	onComments?: () => void;
	deadlineLabel: string;
	tally: VoteTally;
	eligibleCount: number;
	voteState: "open" | "voted" | "own";
	onVote?: () => void;
};

type JudgedProps = {
	state: "judged";
	verdict: Exclude<Verdict, "dismissed">;
	tally: VoteTally;
	sentence?: Sentence;
	headline: string;
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
					{props.category}, {props.title}
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
							<span className="font-extrabold text-red">
								<span aria-hidden="true">◷</span>&nbsp;{props.deadlineLabel}
							</span>
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
									배심원 평결&nbsp;
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
						</div>
					</>
				)}

				{props.state === "dismissed" && (
					<div className="flex items-center gap-3">
						<VerdictStamp verdict="dismissed" />
						<span className="text-control font-bold text-mute">각하 (정족수 미달)</span>
					</div>
				)}

				{props.state === "voting" && (
					<ReactionRow reactions={props.reactions} commentCount={props.commentCount} onComments={props.onComments} />
				)}
			</div>
		</article>
	);
}
