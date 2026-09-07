import type { PostType } from "./post";

export type Verdict = "guilty" | "notGuilty" | "agree" | "disagree" | "dismissed";

export const VERDICT_LABELS: Record<Verdict, string> = {
	guilty: "유죄",
	notGuilty: "무죄",
	agree: "동의",
	disagree: "기각",
	dismissed: "각하"
};

export type VerdictSide = "oppose" | "support" | "none";

export const VERDICT_SIDES: Record<Verdict, VerdictSide> = {
	guilty: "oppose",
	notGuilty: "support",
	agree: "support",
	disagree: "oppose",
	dismissed: "none"
};

export type VoteTally = {
	oppose: number;
	support: number;
};

export const VOTE_VERDICTS: Record<PostType, { oppose: Verdict; support: Verdict }> = {
	spent: { oppose: "guilty", support: "notGuilty" },
	considering: { oppose: "disagree", support: "agree" }
};

export type Sentence = "probation" | "oneDay" | "life";

export const SENTENCE_LABELS: Record<Sentence, string> = {
	probation: "집행유예",
	oneDay: "징역 1일",
	life: "무기징역"
};

export const SENTENCE_NOTES: Record<Sentence, string | null> = {
	probation: null,
	oneDay: "하루 무지출",
	life: "3일 무지출"
};

export type ExecutionStatus = "active" | "done" | "failed";

export const EXECUTION_LABELS: Record<ExecutionStatus, string> = {
	active: "형 집행 중",
	done: "만기 출소",
	failed: "재범"
};

export type Imprisonment = {
	daysLeft: number;
	totalDays: number;
};

export type Execution = Imprisonment & {
	status: ExecutionStatus;
};
