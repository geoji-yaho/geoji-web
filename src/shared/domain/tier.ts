export type Tier = "penniless" | "hardcore" | "flower" | "king";

export const TIER_LABELS: Record<Tier, string> = {
	penniless: "무일푼",
	hardcore: "상거지",
	flower: "꽃거지",
	king: "거지왕"
};

export const TIER_MIN_SCORES: Record<Tier, number> = {
	penniless: 0,
	hardcore: 40,
	flower: 65,
	king: 85
};

export function tierFromScore(score: number) {
	if (score >= TIER_MIN_SCORES.king) {
		return "king";
	}

	if (score >= TIER_MIN_SCORES.flower) {
		return "flower";
	}

	if (score >= TIER_MIN_SCORES.hardcore) {
		return "hardcore";
	}

	return "penniless";
}
