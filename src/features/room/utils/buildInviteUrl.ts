export function buildInviteUrl(inviteCode: string) {
	const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
	return `${globalThis.location.origin}${basename}/invite/${inviteCode}`;
}
