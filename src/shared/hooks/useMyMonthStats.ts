import { useQueries, useQuery } from "@tanstack/react-query";

import { type Expense, expenseQueries } from "../api/expenses";
import { profileQueries } from "../api/profile";
import { roomQueries } from "../api/rooms";
import { type Trial, TRIAL_QUORUM, trialQueries, voteCount } from "../api/trials";
import { baselineSpend, calculateDebtScore } from "../domain/score";
import { type Tier, TIER_LABELS, TIER_MIN_SCORES, tierFromScore } from "../domain/tier";
import { isPast, monthRange } from "../utils/date";

const TIER_ORDER: Tier[] = ["penniless", "hardcore", "flower", "king"];
const KING_LABEL = "이 방의 지배자";

type MyExpense = {
	id: string;
	roomId: string;
	amount: number;
};

function formatNextTier(tier: Tier, score: number) {
	const next = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];

	if (next === undefined) {
		return KING_LABEL;
	}

	return `${TIER_LABELS[next]}까지 ${TIER_MIN_SCORES[next] - score}점`;
}

function collectMyExpenses(roomIds: string[], lists: (Expense[] | undefined)[], userId: string | null) {
	const collected: MyExpense[] = [];
	const seen = new Set<string>();

	if (userId === null) {
		return collected;
	}

	roomIds.forEach((roomId, index) => {
		const list = lists[index];

		if (list === undefined) {
			return;
		}

		for (const expense of list) {
			if (expense.userId !== userId || expense.source !== "quick_tap" || seen.has(expense.id)) {
				continue;
			}

			seen.add(expense.id);
			collected.push({ id: expense.id, roomId, amount: expense.amount });
		}
	});

	return collected;
}

function countJudged(trials: (Trial | null | undefined)[], now: Date) {
	let guilty = 0;
	let notGuilty = 0;
	let dismissed = 0;

	for (const trial of trials) {
		if (!trial) {
			continue;
		}

		if (trial.verdict === "GUILTY") {
			guilty += 1;
		} else if (trial.verdict === "NOT_GUILTY") {
			notGuilty += 1;
		} else if (isPast(trial.votingDeadline, now) && voteCount(trial) < TRIAL_QUORUM) {
			dismissed += 1;
		}
	}

	return { guilty, notGuilty, dismissed, total: guilty + notGuilty + dismissed };
}

export function useMyMonthStats() {
	const now = new Date();
	const range = monthRange(now);

	const me = useQuery(profileQueries.me());
	const rooms = useQuery(roomQueries.list());

	const roomIds = (rooms.data ?? []).map((room) => room.id);
	const expenseLists = useQueries({
		queries: roomIds.map((roomId) => expenseQueries.listByRoom(roomId, range))
	});

	const profile = me.data ?? null;
	const myExpenses = collectMyExpenses(
		roomIds,
		expenseLists.map((result) => result.data),
		profile?.id ?? null
	);

	const trials = useQueries({
		queries: myExpenses.map((expense) => trialQueries.detail(expense.roomId, expense.id))
	});

	const spentThisMonth = myExpenses.reduce((sum, expense) => sum + expense.amount, 0);
	const judged = countJudged(
		trials.map((result) => result.data),
		now
	);
	const score = calculateDebtScore({
		monthlyBudget: profile === null ? null : profile.monthlyBudget,
		spentThisMonth,
		today: now,
		judged: { total: judged.guilty + judged.notGuilty, acquitted: judged.notGuilty }
	});
	const tier: Tier = tierFromScore(score);

	const isPending =
		me.isPending ||
		rooms.isPending ||
		expenseLists.some((result) => result.isPending) ||
		trials.some((result) => result.isPending);
	const errors = [
		me.error,
		rooms.error,
		...expenseLists.map((result) => result.error),
		...trials.map((result) => result.error)
	];
	const error = errors.find((candidate) => candidate !== null) ?? null;

	return {
		isPending,
		isError: error !== null,
		error,
		profile,
		spentThisMonth,
		baseline: profile === null ? null : baselineSpend(profile.monthlyBudget, now),
		score,
		tier,
		nextTierLabel: formatNextTier(tier, score),
		judged
	};
}
