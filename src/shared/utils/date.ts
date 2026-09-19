const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const KST_OFFSET_MS = 9 * HOUR_MS;
const KST_OFFSET = "+09:00";

function shiftToKst(date: Date) {
	return new Date(date.getTime() + KST_OFFSET_MS);
}

function kstMidnight(year: number, monthIndex: number, day: number) {
	return new Date(Date.UTC(year, monthIndex, day) - KST_OFFSET_MS);
}

function toKstIso(date: Date) {
	return shiftToKst(date).toISOString().replace("Z", KST_OFFSET);
}

export function kstCalendar(date: Date) {
	const kst = shiftToKst(date);
	const year = kst.getUTCFullYear();
	const monthIndex = kst.getUTCMonth();

	return {
		year,
		month: monthIndex + 1,
		day: kst.getUTCDate(),
		daysInMonth: new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
	};
}

export function monthRange(date: Date) {
	const kst = shiftToKst(date);
	const year = kst.getUTCFullYear();
	const monthIndex = kst.getUTCMonth();
	const from = kstMidnight(year, monthIndex, 1);
	const to = new Date(kstMidnight(year, monthIndex + 1, 1).getTime() - 1);

	return { from: toKstIso(from), to: toKstIso(to) };
}

export function recentRange(days: number, now = new Date()) {
	const from = new Date(now.getTime() - days * DAY_MS);

	return { from: toKstIso(from), to: toKstIso(now) };
}

export function formatRelativeTime(iso: string, now = new Date()) {
	const elapsed = now.getTime() - new Date(iso).getTime();

	if (elapsed < MINUTE_MS) {
		return "방금";
	}

	if (elapsed < HOUR_MS) {
		return `${Math.floor(elapsed / MINUTE_MS)}분 전`;
	}

	if (elapsed < DAY_MS) {
		return `${Math.floor(elapsed / HOUR_MS)}시간 전`;
	}

	return `${Math.floor(elapsed / DAY_MS)}일 전`;
}

export function formatRemaining(deadlineIso: string, now = new Date()) {
	const remaining = new Date(deadlineIso).getTime() - now.getTime();

	if (remaining <= 0) {
		return "마감";
	}

	if (remaining < HOUR_MS) {
		return `${Math.ceil(remaining / MINUTE_MS)}분 남음`;
	}

	return `마감까지 ${Math.ceil(remaining / HOUR_MS)}시간 남음`;
}

export function isPast(iso: string, now = new Date()) {
	return new Date(iso).getTime() <= now.getTime();
}
