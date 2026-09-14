export type Intensity = "mild" | "spicy" | "hell";

export const INTENSITY_LABELS: Record<Intensity, string> = {
	mild: "순한맛",
	spicy: "매운맛",
	hell: "지옥맛"
};

export type VoteDeadlineMinutes = 30 | 60 | 180 | 360 | 720;

export const VOTE_DEADLINE_MINUTES = [30, 60, 180, 360, 720] as const satisfies readonly VoteDeadlineMinutes[];

export const VOTE_DEADLINE_LABELS: Record<VoteDeadlineMinutes, string> = {
	30: "30분",
	60: "1시간",
	180: "3시간",
	360: "6시간",
	720: "12시간"
};

export function formatVoteDeadlineLabel(minutes: number) {
	return (VOTE_DEADLINE_LABELS as Record<number, string | undefined>)[minutes] ?? `${minutes}분`;
}
