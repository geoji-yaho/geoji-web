import { kstCalendar } from "../utils/date";

export type JudgedCount = {
	total: number;
	acquitted: number;
};

export type DebtScoreInput = {
	monthlyBudget: number | null;
	spentThisMonth: number;
	today: Date;
	judged: JudgedCount;
};

export const DEBT_SCORE_PENDING_LABEL = "집계 전";

const BUDGET_SCORE_MAX = 50;
const VERDICT_SCORE_MAX = 10;
const VERDICT_SCORE_NEUTRAL = 5;
const MIN_ELAPSED_DAYS = 3;
const NO_SPEND_SCORE_WITHOUT_API = 0;
const PARTICIPATION_SCORE_WITHOUT_API = 0;

export const DEBT_SCORE_MAX_WITHOUT_API =
	BUDGET_SCORE_MAX + NO_SPEND_SCORE_WITHOUT_API + PARTICIPATION_SCORE_WITHOUT_API + VERDICT_SCORE_MAX;

export function baselineSpend(monthlyBudget: number, today: Date) {
	const { day, daysInMonth } = kstCalendar(today);
	const elapsedDays = Math.max(day, MIN_ELAPSED_DAYS);

	return (monthlyBudget * elapsedDays) / daysInMonth;
}

function budgetScore(monthlyBudget: number | null, spentThisMonth: number, today: Date) {
	if (monthlyBudget === null) {
		return 0;
	}

	const baseline = baselineSpend(monthlyBudget, today);

	if (baseline <= 0) {
		return 0;
	}

	const raw = BUDGET_SCORE_MAX * (1 - spentThisMonth / baseline);

	return Math.min(BUDGET_SCORE_MAX, Math.max(0, raw));
}

function verdictScore(judged: JudgedCount) {
	if (judged.total === 0) {
		return VERDICT_SCORE_NEUTRAL;
	}

	return VERDICT_SCORE_MAX * (judged.acquitted / judged.total);
}

export function calculateDebtScore(input: DebtScoreInput) {
	const total =
		budgetScore(input.monthlyBudget, input.spentThisMonth, input.today) +
		NO_SPEND_SCORE_WITHOUT_API +
		PARTICIPATION_SCORE_WITHOUT_API +
		verdictScore(input.judged);

	return Math.round(total);
}
