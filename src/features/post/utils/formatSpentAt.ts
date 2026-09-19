const spentAtFormatter = new Intl.DateTimeFormat("ko-KR", {
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hourCycle: "h23",
	timeZone: "Asia/Seoul"
});

export function formatSpentAt(iso: string) {
	return spentAtFormatter.format(new Date(iso));
}
