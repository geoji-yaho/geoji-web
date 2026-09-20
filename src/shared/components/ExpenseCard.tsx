import type { ImageSource, PostType, Reaction } from "../domain/post";
import type { Tier } from "../domain/tier";
import {
	isSupportFirst,
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
import { MemeThumbnail } from "./MemeThumbnail";
import { PostTypeTag } from "./PostTypeTag";
import { ReactionRow } from "./ReactionRow";
import { StatusTag } from "./StatusTag";
import { TallyRow } from "./TallyRow";
import { TierBadge } from "./TierBadge";
import { VerdictStamp } from "./VerdictStamp";

type ExpenseCardBase = {
	name: string;
	imageUrl?: string | null;
	tier?: Tier;
	timeAgo: string;
	imprisonedLabel?: string;
	postType: PostType;
	category?: string;
	title?: string;
	amount: number;
	memo?: string;
	image?: ImageSource;
	reactions?: Reaction[];
	commentCount: number;
	onComments?: () => void;
};

export type ExpenseVoteState = "open" | "voted" | "own" | "closed" | "unknownMe";

const VOTE_BUTTON_LABELS: Record<ExpenseVoteState, string> = {
	open: "투표하기",
	voted: "투표 완료",
	own: "투표하기",
	closed: "투표하기",
	unknownMe: "투표하기"
};

const NO_JUROR_NOTICE = "아직 배심원이 없습니다. 친구를 초대하면 재판이 열립니다";

const VOTE_NOTES: Partial<Record<ExpenseVoteState, string>> = {
	own: "본인의 재판에는 투표할 수 없습니다",
	unknownMe: "내 정보를 불러오지 못해 투표할 수 없습니다"
};

function formatSentenceNote(sentence: Sentence, sentenceLabel: string | undefined) {
	if (sentenceLabel !== undefined) {
		return null;
	}

	const note = SENTENCE_NOTES[sentence];
	return note === null ? null : ` (${note})`;
}

type VotingProps = {
	state: "voting";
	deadlineLabel: string;
	tally: VoteTally;
	eligibleCount: number;
	voteState: ExpenseVoteState;
	onVote?: () => void;
};

type JudgedProps = {
	state: "judged";
	verdict: Exclude<Verdict, "dismissed">;
	tally: VoteTally;
	sentence?: Sentence;
	sentenceLabel?: string;
	headline?: string;
	meme?: ImageSource;
	onOpenVerdict?: () => void;
};

type DismissedProps = {
	state: "dismissed";
};

type PlainProps = {
	state: "plain";
};

type ExpenseCardProps = ExpenseCardBase & (VotingProps | JudgedProps | DismissedProps | PlainProps);

export function ExpenseCard(props: ExpenseCardProps) {
	const { oppose, support } = VOTE_VERDICTS[props.postType];
	const subject = [props.category, props.title].filter((part) => part !== undefined && part !== "").join(", ");

	return (
		<article className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-card">
			<div className="flex items-start gap-2.5">
				<Avatar name={props.name} src={props.imageUrl} />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-1.5">
						<span className="text-sm font-black text-ink">{props.name}</span>
						{props.tier && <TierBadge tier={props.tier} />}
						{props.imprisonedLabel && <StatusTag label={props.imprisonedLabel} />}
					</div>
					<span className="text-caption text-dim">{props.timeAgo}</span>
				</div>
				<PostTypeTag postType={props.postType} />
			</div>

			<div className="flex flex-col gap-1">
				{subject !== "" && <span className="text-xs text-mute">{subject}</span>}
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
							{props.eligibleCount > 0 && (
								<span className="text-dim">
									{props.tally.oppose + props.tally.support}/{props.eligibleCount} 투표
								</span>
							)}
						</div>
						{props.eligibleCount === 0 ? (
							<span className="text-caption text-dim">{NO_JUROR_NOTICE}</span>
						) : (
							<TallyRow
								tally={props.tally}
								opposeLabel={VERDICT_LABELS[oppose]}
								supportLabel={VERDICT_LABELS[support]}
								supportFirst={isSupportFirst(props.postType)}
							/>
						)}
						<Button variant="ink" disabled={props.voteState !== "open"} onClick={props.onVote}>
							{VOTE_BUTTON_LABELS[props.voteState]}
						</Button>
						{VOTE_NOTES[props.voteState] && (
							<span className="text-center text-caption text-dim">{VOTE_NOTES[props.voteState]}</span>
						)}
					</>
				)}

				{props.state === "judged" && (
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
									AI 판사 선고&nbsp;
									<b className="font-black text-red">{props.sentenceLabel ?? SENTENCE_LABELS[props.sentence]}</b>
									{formatSentenceNote(props.sentence, props.sentenceLabel)}
								</span>
							)}
							{props.headline && <span className="text-control text-text">&ldquo;{props.headline}&rdquo;</span>}
						</div>
						<div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
							<MemeThumbnail meme={props.meme} size="sm" />
							{props.onOpenVerdict && (
								<Button variant="outline" className="rounded-2xl px-1 py-2 text-center" onClick={props.onOpenVerdict}>
									판결문 보기
								</Button>
							)}
						</div>
					</div>
				)}

				{props.state === "dismissed" && (
					<div className="flex items-center gap-3">
						<VerdictStamp verdict="dismissed" />
						<span className="text-control font-bold text-mute">각하 (정족수 미달)</span>
					</div>
				)}

				<ReactionRow
					reactions={props.reactions ?? []}
					commentCount={props.commentCount}
					onComments={props.onComments}
				/>
			</div>
		</article>
	);
}
