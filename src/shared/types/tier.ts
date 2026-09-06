/** 거지력 구간에 따른 등급 4종. 낮음에서 높음 순서는 미결정이라 순서 배열을 두지 않는다 */
export type Tier = "penniless" | "hardcore" | "flower" | "king";

export const TIER_LABELS: Record<Tier, string> = {
	penniless: "무일푼",
	hardcore: "상거지",
	flower: "꽃거지",
	king: "거지왕"
};
