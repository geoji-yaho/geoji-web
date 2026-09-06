import { Avatar } from "./Avatar";
import { TagBadge } from "./Badge";
import { VerdictStamp } from "./VerdictBadge";

type ExpenseCardBase = {
	name: string;
	tier: string;
	timeAgo: string;
	statusLabel: string;
	category: string;
	amount: number;
	memo: string;
};

type VotingState = {
	state: "voting";
	deadlineLabel: string;
	voteProgressLabel: string;
	guiltyCount: number;
	notGuiltyCount: number;
	reactions: { emoji: string; count: number }[];
	commentCount: number;
};

type JudgedState = {
	state: "judged";
	verdictLabel: string;
	agreeCount: number;
	disagreeCount: number;
	judgeQuote: string;
};

type ExpenseCardProps = ExpenseCardBase & (VotingState | JudgedState);

export function ExpenseCard(props: ExpenseCardProps) {
	return (
		<article className="flex flex-col gap-4 rounded-3xl bg-card p-5">
			<div className="flex items-start gap-3">
				<Avatar label={props.name.slice(0, 1)} />
				<div className="flex-1">
					<div className="flex items-center gap-1.5">
						<span className="font-bold text-ink">{props.name}</span>
						<TagBadge label={props.tier} />
					</div>
					<span className="text-xs text-muted">{props.timeAgo}</span>
				</div>
				<TagBadge label={props.statusLabel} tone={props.state === "voting" ? "soft" : "outline"} />
			</div>

			<div>
				<span className="text-sm text-muted">{props.category}</span>
				<p className="text-3xl font-black text-ink">{props.amount.toLocaleString("ko-KR")}원</p>
				<p className="mt-1 text-sm text-ink">&ldquo;{props.memo}&rdquo;</p>
			</div>

			{props.state === "voting" ? (
				<>
					<div className="flex items-center justify-between border-t border-line pt-3 text-xs">
						<span className="font-bold text-terracotta">⏱ {props.deadlineLabel}</span>
						<span className="text-muted">{props.voteProgressLabel}</span>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							className="flex-1 rounded-full bg-terracotta-soft py-3 text-sm font-bold text-terracotta"
						>
							유죄 {props.guiltyCount}
						</button>
						<button type="button" className="flex-1 rounded-full border border-line py-3 text-sm font-bold text-muted">
							무죄 {props.notGuiltyCount}
						</button>
					</div>
					<div className="flex items-center gap-3 text-xs text-muted">
						{props.reactions.map((reaction) => (
							<span key={reaction.emoji}>
								{reaction.emoji} {reaction.count}
							</span>
						))}
						<span>· 댓글 {props.commentCount}</span>
					</div>
				</>
			) : (
				<div className="flex items-center gap-3">
					<VerdictStamp label={props.verdictLabel} />
					<div className="flex-1">
						<span className="text-sm font-bold text-ink">
							{props.verdictLabel} {props.disagreeCount} · 동의 {props.agreeCount}
						</span>
						<p className="mt-0.5 text-xs text-muted">&ldquo;{props.judgeQuote}&rdquo;</p>
					</div>
				</div>
			)}
		</article>
	);
}
