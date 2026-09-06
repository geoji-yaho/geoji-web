/** 잔소리 강도. 방장이 정하는 AI 판사의 말투 수위. 기본은 매운맛 */
export type Intensity = "mild" | "spicy" | "hell";

export const INTENSITY_LABELS: Record<Intensity, string> = {
	mild: "순한맛",
	spicy: "매운맛",
	hell: "지옥맛"
};
