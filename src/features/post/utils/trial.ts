import type { Trial } from "@/shared/api/trials";
import type { Execution } from "@/shared/domain/verdict";

const DAY_MS = 24 * 60 * 60 * 1000;

const spentAtFormatter = new Intl.DateTimeFormat("ko-KR", {
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hourCycle: "h23",
	timeZone: "Asia/Seoul"
});

export function executionFromTrial(trial: Trial, now = new Date()) {
	if (trial.verdict !== "GUILTY" || !trial.sentenceDays || !trial.sentenceEndedAt) {
		return null;
	}

	const totalDays = trial.sentenceDays;
	const remainingMs = new Date(trial.sentenceEndedAt).getTime() - now.getTime();

	if (remainingMs <= 0) {
		const done: Execution = { status: "done", daysLeft: 0, totalDays };
		return done;
	}

	const active: Execution = {
		status: "active",
		daysLeft: Math.min(totalDays, Math.ceil(remainingMs / DAY_MS)),
		totalDays
	};
	return active;
}

export function formatSpentAt(iso: string) {
	return spentAtFormatter.format(new Date(iso));
}

export const TRIAL_MESSAGES = {
	loading: "판결을 불러오는 중",
	noTrial: "재판이 없는 지출입니다",
	noExpense: "지출을 찾을 수 없습니다"
} as const;
