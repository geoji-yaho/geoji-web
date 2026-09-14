import { type Expense, POST_TYPE_BY_EXPENSE_SOURCE } from "@/shared/api/expenses";
import type { RoomMember } from "@/shared/api/members";
import { sentenceFromDays, type Trial, VERDICT_BY_TRIAL_VERDICT } from "@/shared/api/trials";
import { ExpenseCard } from "@/shared/components/ExpenseCard";
import { type Tier, tierFromScore } from "@/shared/domain/tier";
import { formatRelativeTime, formatRemaining, isPast } from "@/shared/utils/date";

const QUORUM_VOTES = 2;
const HEADLINE_MAX_LENGTH = 30;
const FIRST_SENTENCE = /^[\s\S]*?[.!?](?=\s|$)/;

function headlineFrom(verdictText: string | null) {
	const text = verdictText?.trim();

	if (!text) {
		return undefined;
	}

	const sentence = (FIRST_SENTENCE.exec(text)?.[0] ?? text).trim();

	return sentence.length > HEADLINE_MAX_LENGTH ? `${sentence.slice(0, HEADLINE_MAX_LENGTH)}…` : sentence;
}

function voteDeadlineLabel(deadline: string) {
	const remaining = formatRemaining(deadline);

	if (remaining === "마감") {
		return "투표 마감";
	}

	return remaining.startsWith("마감까지") ? `투표 ${remaining}` : `투표 마감까지 ${remaining}`;
}

function voteStateOf(trial: Trial, isOwn: boolean, closed: boolean) {
	if (closed) {
		return "closed";
	}

	if (isOwn) {
		return "own";
	}

	return trial.myVote === null ? "open" : "voted";
}

type TrialExpenseCardProps = {
	expense: Expense;
	trial: Trial | null | undefined;
	author: RoomMember | undefined;
	myUserId: string | undefined;
	eligibleCount: number;
	commentCount: number;
	onVote: () => void;
	onOpenVerdict: () => void;
	onComments: () => void;
};

export function TrialExpenseCard({
	expense,
	trial,
	author,
	myUserId,
	eligibleCount,
	commentCount,
	onVote,
	onOpenVerdict,
	onComments
}: TrialExpenseCardProps) {
	const tier: Tier | undefined = author && author.debtScore !== null ? tierFromScore(author.debtScore) : undefined;
	const base = {
		name: author?.nickname ?? "",
		tier,
		timeAgo: formatRelativeTime(expense.spentAt),
		postType: POST_TYPE_BY_EXPENSE_SOURCE[expense.source],
		category: expense.category ?? undefined,
		title: expense.memo ?? undefined,
		amount: expense.amount,
		commentCount,
		onComments
	};

	if (!trial) {
		return <ExpenseCard {...base} state="plain" />;
	}

	const tally = { oppose: trial.guiltyVotes, support: trial.notGuiltyVotes };

	if (trial.verdict !== null) {
		const verdict = VERDICT_BY_TRIAL_VERDICT[trial.verdict];

		if (verdict === "dismissed") {
			return <ExpenseCard {...base} state="dismissed" />;
		}

		return (
			<ExpenseCard
				{...base}
				state="judged"
				verdict={verdict}
				tally={tally}
				sentence={verdict === "guilty" ? sentenceFromDays(trial.sentenceDays) : undefined}
				headline={headlineFrom(trial.verdictText)}
				onOpenVerdict={onOpenVerdict}
			/>
		);
	}

	const closed = isPast(trial.votingDeadline);

	if (closed && tally.oppose + tally.support < QUORUM_VOTES) {
		return <ExpenseCard {...base} state="dismissed" />;
	}

	return (
		<ExpenseCard
			{...base}
			state="voting"
			deadlineLabel={voteDeadlineLabel(trial.votingDeadline)}
			tally={tally}
			eligibleCount={eligibleCount}
			voteState={voteStateOf(trial, myUserId !== undefined && expense.userId === myUserId, closed)}
			onVote={onVote}
		/>
	);
}
