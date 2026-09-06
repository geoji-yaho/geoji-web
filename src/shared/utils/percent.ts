export function toPercent(value: number, max: number) {
	return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
}
