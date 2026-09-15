import { type Expense, POST_TYPE_BY_EXPENSE_SOURCE } from "@/shared/api/expenses";
import { memberName, memberTier, type RoomMember } from "@/shared/api/members";
import {
	headlineFromVerdictText,
	sentenceFromDays,
	tallyFromTrial,
	type Trial,
	verdictFromTrial
} from "@/shared/api/trials";
import { ExpenseCard } from "@/shared/components/ExpenseCard";
import type { Tier } from "@/shared/domain/tier";
import { formatRelativeTime, formatRemaining, isPast } from "@/shared/utils/date";

const EMPTY_TALLY = { oppose: 0, support: 0 };

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
	const tier: Tier | undefined = memberTier(author);
	const base = {
		name: memberName(author),
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
		if (base.postType !== "considering") {
			return <ExpenseCard {...base} state="plain" />;
		}

		return (
			<ExpenseCard {...base} state="voting" tally={EMPTY_TALLY} eligibleCount={eligibleCount} voteState="unavailable" />
		);
	}

	const tally = tallyFromTrial(trial);
	const verdict = verdictFromTrial(trial);

	if (verdict === "dismissed") {
		return <ExpenseCard {...base} state="dismissed" />;
	}

	if (verdict !== null) {
		return (
			<ExpenseCard
				{...base}
				state="judged"
				verdict={verdict}
				tally={tally}
				sentence={verdict === "guilty" ? sentenceFromDays(trial.sentenceDays) : undefined}
				headline={headlineFromVerdictText(trial.verdictText) ?? undefined}
				onOpenVerdict={onOpenVerdict}
			/>
		);
	}

	const closed = isPast(trial.votingDeadline);

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
