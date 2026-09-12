export function formatAmount(amount: number) {
	return amount.toLocaleString("ko-KR");
}

export function parseAmount(value: string): number | null {
	const digits = value.replace(/,/g, "").trim();
	if (!/^\d+$/.test(digits)) return null;

	const parsed = Number(digits);
	return Number.isSafeInteger(parsed) ? parsed : null;
}
