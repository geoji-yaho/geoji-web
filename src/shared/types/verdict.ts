import type { PostType } from "./post";

/** 판결 결과 5종. 돈 썼어요는 유죄와 무죄, 살까 말까는 동의와 기각, 정족수 미달은 각하 */
export type Verdict = "guilty" | "notGuilty" | "agree" | "disagree" | "dismissed";

export const VERDICT_LABELS: Record<Verdict, string> = {
	guilty: "유죄",
	notGuilty: "무죄",
	agree: "동의",
	disagree: "기각",
	dismissed: "각하"
};

/** 판결이 피고에게 불리한 편(유죄, 기각)인지 유리한 편(무죄, 동의)인지. 각하는 어느 편도 아니다. 색은 컴포넌트 층이 정한다 */
export type VerdictSide = "oppose" | "support" | "none";

export const VERDICT_SIDES: Record<Verdict, VerdictSide> = {
	guilty: "oppose",
	notGuilty: "support",
	agree: "support",
	disagree: "oppose",
	dismissed: "none"
};

/** 표 집계. 유죄와 기각이 oppose(테라코타), 무죄와 동의가 support(그린) */
export type VoteTally = {
	oppose: number;
	support: number;
};

/** 게시물 타입마다 배심원이 고르는 두 결과 */
export const VOTE_VERDICTS: Record<PostType, { oppose: Verdict; support: Verdict }> = {
	spent: { oppose: "guilty", support: "notGuilty" },
	considering: { oppose: "disagree", support: "agree" }
};

/** 형량 3종. 돈 썼어요가 유죄일 때만 붙는다 */
export type Sentence = "probation" | "oneDay" | "life";

export const SENTENCE_LABELS: Record<Sentence, string> = {
	probation: "집행유예",
	oneDay: "징역 1일",
	life: "무기징역"
};

/** 형량 옆에 병기하는 무지출 기간. 집행유예는 없다 */
export const SENTENCE_NOTES: Record<Sentence, string | null> = {
	probation: null,
	oneDay: "하루 무지출",
	life: "3일 무지출"
};

/** 형 집행 상태. 기간 중이면 active, 무지출로 버텼으면 done, 돈 썼어요를 올렸으면 failed */
export type ExecutionStatus = "active" | "done" | "failed";

export const EXECUTION_LABELS: Record<ExecutionStatus, string> = {
	active: "형 집행 중",
	done: "만기 출소",
	failed: "재범"
};

/** 형 집행 진행. daysLeft는 남은 무지출 일수, totalDays는 형량 전체 일수 */
export type Imprisonment = {
	daysLeft: number;
	totalDays: number;
};

export type Execution = Imprisonment & {
	status: ExecutionStatus;
};
